import express from 'express';
import {
    deleteProfile,
    editProfile,
    userProfile,
} from '../controllers/userControllers';

const userRouter = express.Router();

userRouter.get('/:id((\\d+))', userProfile);
userRouter.get('/edit', editProfile);
userRouter.get('/delete', deleteProfile);

export default userRouter;
