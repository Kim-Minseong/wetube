import Video from '../models/Video';
import User from '../models/User';
import Comment from '../models/Comment';

export const home = async (req, res) => {
    const videos = await Video.find({})
        .sort({ createdAt: 'desc' })
        .populate('owner');
    return res.render('home', { pageTitle: 'Home', videos });
};

export const search = async (req, res) => {
    const { query } = req.query;
    let videos = [];
    if (query) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(query, 'i'),
            },
        }).populate('owner');
    }
    return res.render('videos/search', { pageTitle: 'Search', videos });
};

export const getUploadVideo = (req, res) => {
    return res.render('videos/uploadVideo', { pageTitle: 'Upload Video' });
};

export const postUploadVideo = async (req, res) => {
    const {
        body: { title, description, hashtags },
        files: { video, thumbnail },
        session: {
            user: { _id },
        },
    } = req;

    try {
        const newVideo = await Video.create({
            title,
            description,
            videoUrl: video[0].location,
            thumbUrl: thumbnail[0].location,
            hashtags: Video.formatHashtags(hashtags),
            owner: _id,
        });

        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        req.flash('success', 'Upload Success!');
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.status(400).render('videos/uploadVideo', {
            pageTitle: 'Upload Video',
            errorMessage: 'Upload Failed, Please check the form.',
        });
    }
};

export const watchVideo = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id)
        .populate('owner')
        .populate('comments');

    if (!video) {
        return res
            .status(404)
            .render('layout/404', { pageTitle: 'Video not Found.' });
    }

    return res.render('videos/watchVideo', {
        pageTitle: video.title,
        video,
    });
};

export const getEditVideo = async (req, res) => {
    const {
        params: { id },
        session: { user },
    } = req;
    const video = await Video.findById(id);

    if (!video) {
        return res.render('layout/404', { pageTitle: 'Video not Found.' });
    }

    if (String(video.owner) !== String(user._id)) {
        return res.status(403).redirect('/');
    }

    return res.render('videos/editVideo', {
        pageTitle: `Edit ${video.title}`,
        video,
    });
};

export const postEditVideo = async (req, res) => {
    const {
        params: { id },
        body: { title, description, hashtags },
        session: { user },
    } = req;

    const video = await Video.findById(id);

    if (!video) {
        return res
            .status(404)
            .render('layout/404', { pageTitle: 'Video not Found.' });
    }

    if (String(video.owner) !== String(user._id)) {
        return res.status(403).redirect('/');
    }

    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    req.flash('success', 'Change Saved!');
    return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
    const {
        params: { id },
        session: { user },
    } = req;

    const video = await Video.findById(id);

    if (!video) {
        return res
            .status(404)
            .render('layout/404', { pageTitle: 'Video not Found.' });
    }

    if (String(video.owner) !== String(user._id)) {
        req.flash('error', 'Not authorized');
        return res.status(403).redirect('/');
    }

    await Video.findByIdAndDelete(id);
    return res.redirect('/');
};

export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};

export const createComment = async (req, res) => {
    const {
        params: { id },
        body: { text },
        session: {
            user: { _id },
        },
    } = req;

    const video = await Video.findById(id);
    const user = await User.findById(_id);

    if (!video) {
        req.flash('error', 'Video Not Found');
        return res.setStatus(404);
    }

    const comment = await Comment.create({
        text,
        writer: _id,
        video: id,
    });

    user.comments.push(comment._id);
    video.comments.push(comment._id);
    await user.save();
    await video.save();

    return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
    const {
        params: { id },
        session: {
            user: { _id },
        },
    } = req;

    const comment = await Comment.findById(id);

    if (String(comment.writer) === String(_id)) {
        await Comment.findByIdAndDelete(id);
        return res.sendStatus(202);
    } else {
        return res.sendStatus(400);
    }
};
