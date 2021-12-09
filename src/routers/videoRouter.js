import express from 'express';

import {
    deleteVideo,
    getEditVideo,
    getUploadVideo,
    postEditVideo,
    postUploadVideo,
    watchVideo,
} from '../controllers/videoController';
import { protectorMiddleware, uploadVideo } from '../middleWares';

const videoRouter = express.Router();

videoRouter
    .route('/upload')
    .all(protectorMiddleware)
    .get(getUploadVideo)
    .post(uploadVideo.single('video'), postUploadVideo);
videoRouter.get('/:id(([0-9a-z]{24}))', watchVideo);
videoRouter
    .route('/:id(([0-9a-z]{24}))/edit')
    .all(protectorMiddleware)
    .get(getEditVideo)
    .post(postEditVideo);
videoRouter.get(
    '/:id(([0-9a-z]{24}))/delete',
    protectorMiddleware,
    deleteVideo
);

export default videoRouter;
