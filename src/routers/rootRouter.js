import express from 'express';
import {
    getJoin,
    getLogin,
    postJoin,
    postLogin,
} from '../controllers/userControllers';
import { home, search } from '../controllers/videoController';

const globalRouter = express.Router();

globalRouter.get('/', home);
globalRouter.get('/search', search);
globalRouter.route('/join').get(getJoin).post(postJoin);
globalRouter.route('/login').get(getLogin).post(postLogin);

export default globalRouter;
