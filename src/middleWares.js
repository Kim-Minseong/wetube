import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    },
});

const s3ImageUploader = multerS3({
    s3: s3,
    bucket: 'alwaysineeedyou-wetube/images',
    acl: 'public-read',
});

const s3VideoUploader = multerS3({
    s3: s3,
    bucket: 'alwaysineeedyou-wetube/videos',
    acl: 'public-read',
});

const isHeroku = process.env.NODE_ENV === 'production';

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
    storage: isHeroku ? s3ImageUploader : undefined,
});
export const uploadVideo = multer({
    dest: 'uploads/videos',
    storage: isHeroku ? s3VideoUploader : undefined,
});
