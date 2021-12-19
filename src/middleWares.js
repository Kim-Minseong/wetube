import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    },
});

const multerUploader = multerS3({
    s3: s3,
    bucket: 'wetube-alwaysineeedyou',
    acl: 'public-read',
});

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
        req.flash('error', 'Not authorized');
        return res.redirect('/login');
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        next();
    } else {
        req.flash('error', 'Not authorized');
        return res.redirect('/');
    }
};

export const uploadAvatar = multer({
    dest: 'uploads/avatar',
    storage: multerUploader,
});
export const uploadVideo = multer({
    dest: 'uploads/videos',
    storage: multerUploader,
});
