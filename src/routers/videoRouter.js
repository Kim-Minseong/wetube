import express from 'express';

import {
    deleteVideo,
    editVideo,
    uploadVideo,
    watchVideo,
} from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.get('/upload', uploadVideo);
videoRouter.get('/:id', watchVideo);
videoRouter.get('/:id/edit', editVideo);
videoRouter.get('/:id/delete', deleteVideo);

export default videoRouter;
