import multer from 'multer';

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = 'Wetube';
    if (req.session.loggedIn) {
        res.locals.loggedInUser = req.session.user || {};
        res.locals.loggedIn = true;
    }
    next();
};

export const protectorMiddleware = (req, res, next) => {
    if (req.session.loggedIn) {
        next();
    } else {
        return res.redirect('/login');
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        next();
    } else {
        return res.redirect('/');
    }
};

export const uploadAvatar = multer({ dest: 'uploads/avatar' });
