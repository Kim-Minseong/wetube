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
videoRouter.get('/:id(([0-9a-z]{24}))', watchVideo);
videoRouter
    .route('/:id(([0-9a-z]{24}))/edit')
    .get(getEditVideo)
    .post(postEditVideo);
videoRouter.get('/:id(([0-9a-z]{24}))/delete', deleteVideo);

export default videoRouter;
