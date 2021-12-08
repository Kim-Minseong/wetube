import express from 'express';
import {
    deleteProfile,
    finishGithubLogin,
    getEditProfile,
    postEditProfile,
    startGithubLogin,
    userProfile,
} from '../controllers/userControllers';
import { protectorMiddleware, publicOnlyMiddleware } from '../middleWares';

const userRouter = express.Router();

userRouter.get('/:id((\\d+))', userProfile);
userRouter
    .route('/edit')
    .all(protectorMiddleware)
    .get(getEditProfile)
    .post(postEditProfile);
userRouter.get('/delete', protectorMiddleware, deleteProfile);
userRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);
userRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);
export default userRouter;
