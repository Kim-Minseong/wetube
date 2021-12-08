import express from 'express';
import {
    getJoin,
    getLogin,
    postJoin,
    postLogin,
    logout,
} from '../controllers/userControllers';
import { home, search } from '../controllers/videoController';
import { protectorMiddleware, publicOnlyMiddleware } from '../middleWares';

const globalRouter = express.Router();

globalRouter.get('/', home);
globalRouter.get('/search', search);
globalRouter
    .route('/join')
    .all(publicOnlyMiddleware)
    .get(getJoin)
    .post(postJoin);
globalRouter
    .route('/login')
    .all(publicOnlyMiddleware)
    .get(getLogin)
    .post(postLogin);
globalRouter.get('/logout', protectorMiddleware, logout);

export default globalRouter;
