import express from 'express';
import { join, login } from '../controllers/userControllers';
import { home, search } from '../controllers/videoController';

const globalRouter = express.Router();

globalRouter.get('/', home);
globalRouter.get('/search', search);
globalRouter.get('/join', join);
globalRouter.get('/login', login);

export default globalRouter;