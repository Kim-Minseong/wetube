import express from 'express';
import { getJoin, login, postJoin } from '../controllers/userControllers';
import { home, search } from '../controllers/videoController';

const globalRouter = express.Router();

globalRouter.get('/', home);
globalRouter.get('/search', search);
globalRouter.route('/join').get(getJoin).post(postJoin);
globalRouter.get('/login', login);

export default globalRouter;
