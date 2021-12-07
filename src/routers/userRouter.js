import express from 'express';
import {
    deleteProfile,
    editProfile,
    finishGithubLogin,
    startGithubLogin,
    userProfile,
} from '../controllers/userControllers';

const userRouter = express.Router();

userRouter.get('/:id((\\d+))', userProfile);
userRouter.get('/edit', editProfile);
userRouter.get('/delete', deleteProfile);
userRouter.get('/github/start', startGithubLogin);
userRouter.get('/github/finish', finishGithubLogin);
export default userRouter;
