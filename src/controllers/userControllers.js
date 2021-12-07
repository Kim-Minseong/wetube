import User from '../models/User';
import bcrypt from 'bcrypt';

export const getJoin = (req, res) => {
    return res.render('join', { pageTitle: 'Join' });
};

export const postJoin = async (req, res) => {
    const { email, username, password, password2 } = req.body;
    const emailExist = await User.exists({ email });
    if (emailExist) {
        return res.status(400).render('join', {
            pageTitle: 'Join',
            errorMessage: 'The email already taken.',
        });
    }

    if (password !== password2) {
        return res.status(400).render('join', {
            pageTitle: 'Join',
            errorMessage: 'Password confirmation does not match.',
        });
    }

    try {
        await User.create({
            email,
            username,
            password,
        });
        return res.redirect('/login');
    } catch (error) {
        console.log(error);
        return res.status(400).render('join', {
            pageTitle: 'Join',
            errorMessage: 'Join is Failed. Please check the form',
        });
    }
};

export const getLogin = (req, res) => {
    return res.render('login', { pageTitle: 'Login' });
};

export const postLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).render('login', {
            pageTitle: 'Login',
            errorMessage: 'An account with this email does not exists',
        });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
        return res.status(400).render('login', {
            pageTitle: 'Login',
            errorMessage: 'Wrong password',
        });
    }

    req.session.loggedIn = true;
    req.session.user = user;
    console.log(req.session);

    return res.redirect('/');
};

export const userProfile = (req, res) => {
    return res.render('userProfile', { pageTitle: 'User Profile' });
};

export const editProfile = (req, res) => {
    return res.render('editProfile', { pageTitle: 'Edit Profile' });
};

export const deleteProfile = (req, res) => {
    return res.render('deleteProfile', { pageTitle: 'Delete Profile' });
};
