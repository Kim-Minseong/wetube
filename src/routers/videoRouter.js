import express from 'express';

import {
    deleteVideo,
    getEditVideo,
    getUploadVideo,
    postEditVideo,
    postUploadVideo,
    watchVideo,
} from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.route('/upload').get(getUploadVideo).post(postUploadVideo);
videoRouter.get('/:id(([0-9a-z])\\w+)', watchVideo);
videoRouter.route('/:id(\\d+)/edit').get(getEditVideo).post(postEditVideo);
videoRouter.get('/:id(\\d+)/delete', deleteVideo);

export default videoRouter;
