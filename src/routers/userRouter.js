import express from 'express';
import {
    deleteProfile,
    finishGithubLogin,
    getChangePassword,
    getEditProfile,
    postChangePassword,
    postEditProfile,
    startGithubLogin,
    userProfile,
} from '../controllers/userControllers';
import {
    protectorMiddleware,
    publicOnlyMiddleware,
    uploadAvatar,
} from '../middleWares';

const userRouter = express.Router();

userRouter.get('/:id((\\d+))', userProfile);

userRouter
    .route('/edit')
    .all(protectorMiddleware)
    .get(getEditProfile)
    .post(uploadAvatar.single('avatar'), postEditProfile);

userRouter
    .route('/change-password')
    .all(protectorMiddleware)
    .get(getChangePassword)
    .post(postChangePassword);

userRouter.get('/delete', protectorMiddleware, deleteProfile);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);
export default userRouter;
