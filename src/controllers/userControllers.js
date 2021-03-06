import User from '../models/User';
import Video from '../models/Video';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';

export const getJoin = (req, res) => {
    return res.render('users/join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res) => {
    const { email, username, password, password2 } = req.body;
    const emailExist = await User.exists({ email });
    if (emailExist) {
        return res.status(400).render('users/join', {
            pageTitle: 'Join',
            errorMessage: 'The email already taken.',
        });
    }

    if (password !== password2) {
        return res.status(400).render('users/join', {
            pageTitle: 'Join',
            errorMessage: 'Password confirmation does not match.',
        });
    }

    try {
        await User.create({
            email,
            username,
            password: await User.hashPassword(password),
        });
        return res.redirect('/login');
    } catch (error) {
        console.log(error);
        return res.status(400).render('users/join', {
            pageTitle: 'Join',
            errorMessage: 'Join is Failed. Please check the form',
        });
    }
};

export const getLogin = (req, res) => {
    return res.render('users/login', { pageTitle: 'Login' });
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, socialOnly: false });

    if (!user) {
        return res.status(400).render('users/login', {
            pageTitle: 'Login',
            errorMessage: 'An account with this email does not exists',
        });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        return res.status(400).render('users/login', {
            pageTitle: 'Login',
            errorMessage: 'Wrong password',
        });
    }

    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect('/');
};

export const userProfile = async (req, res) => {
    const {
        params: { id },
    } = req;

    const user = await User.findById(id).populate('videos');

    if (!user) {
        res.status(404).render('layout/404', { pageTitle: 'User not found.' });
    }

    return res.render('users/userProfile', {
        pageTitle: `${user.username}'s profile`,
        user,
    });
};

export const getEditProfile = async (req, res) => {
    const {
        session: { user },
        params: { id },
    } = req;

    if (String(user._id) !== String(id)) {
        req.flash('error', 'Not authorized');
        return res.redirect('/');
    }

    return res.render('users/editProfile', { pageTitle: 'Edit Profile' });
};

export const postEditProfile = async (req, res) => {
    const {
        session: {
            user: { _id, email: sessionEmail, avatarUrl },
        },
        body: { email, username },
        file,
    } = req;

    try {
        if (sessionEmail !== email) {
            const emailExsits = await User.exists({ email });
            if (emailExsits) {
                return res.render('users/editProfile', {
                    pageTitle: 'Edit Profile',
                    errorMessage: 'Email already exists',
                });
            }
        }
        const isHeroku = process.env.NODE_ENV === 'production';
        const updateUser = await User.findByIdAndUpdate(
            _id,
            {
                avatarUrl: file
                    ? isHeroku
                        ? file.location
                        : file.path
                    : avatarUrl,
                email,
                username,
            },
            { new: true }
        );

        req.session.user = updateUser;

        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.render('users/editProfile', {
            pageTitle: 'Edit Profile',
            errorMessage: 'Update Failed',
        });
    }
};

export const getChangePassword = (req, res) => {
    const { socialOnly } = req.session.user;
    if (socialOnly) {
        req.flash('error', "Can't Change Password");
        return res.redirect('/');
    }
    return res.render('users/changePassword', { pageTitle: 'Change Password' });
};

export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: { _id, password },
        },
        body: { oldPassword, newPassword, newPasswordConfirm },
    } = req;

    if (newPassword !== newPasswordConfirm) {
        return res.status(400).render('users/changePassword', {
            pageTitle: 'Change Password',
            errorMessage: 'Password confirm does not match.',
        });
    }

    const ok = await bcrypt.compare(oldPassword, password);
    if (!ok) {
        return res.status(400).render('users/changePassword', {
            pageTitle: 'Change Password',
            errorMessage: 'Current Password is incorrect.',
        });
    }

    const hashPassword = await User.hashPassword(newPassword);

    const user = await User.findById(_id);
    user.password = hashPassword;
    req.session.user.password = user.password;
    req.flash('info', 'Password Update');
    res.redirect('/users/edit');
};

export const deleteProfile = (req, res) => {
    return res.render('users/deleteProfile', { pageTitle: 'Delete Profile' });
};

export const logout = (req, res) => {
    req.flash('info', 'Bye Bye');
    req.session.destroy();
    return res.redirect('/');
};

// social (github) Login

export const startGithubLogin = (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const config = {
        client_id: process.env.GIT_CLIENT_ID,
        scope: 'read:user user:email',
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const config = {
        client_id: process.env.GIT_CLIENT_ID,
        client_secret: process.env.GIT_CLIENT_SCRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
        })
    ).json();

    if ('access_token' in tokenRequest) {
        const { access_token } = tokenRequest;
        const userRequest = await (
            await fetch('https://api.github.com/user', {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        let user = await User.findOne({ email: userRequest.email });
        if (!user) {
            user = await User.create({
                email: userRequest.email,
                avatarUrl: userRequest.avatar_url,
                username: userRequest.login,
                password: '',
                socialOnly: true,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect('/');
    } else {
        return res.status(400).redirect('/login');
    }
};
