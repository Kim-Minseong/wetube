export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = 'Wetube';
    if (req.session.loggedIn) {
        res.locals.loggedInUser = req.session.user;
        res.locals.loggedIn = true;
    }
    next();
};
