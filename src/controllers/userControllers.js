export const join = (req, res) => {
    return res.render('join', { pageTitle: 'Join' });
};

export const login = (req, res) => {
    return res.render('login', { pageTitle: 'Login' });
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
