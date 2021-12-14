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
    .post(
        uploadVideo.fields([
            { name: 'video', maxCount: 1 },
            { name: 'thumbnail', maxCount: 1 },
        ]),
        postUploadVideo
    );
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
