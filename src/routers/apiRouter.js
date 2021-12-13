import express from 'express';
import { registerView } from '../controllers/videoController';

const apiRouter = express.Router();

apiRouter.post('/videos/:id([0-9a-z]{24})/view', registerView);

export default apiRouter;
