import Video from '../models/Video';

export const home = async (req, res) => {
    const videos = await Video.find({}).sort({ createdAt: 'desc' });
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
        });
    }
    return res.render('search', { pageTitle: 'Search', videos });
};

export const getUploadVideo = (req, res) => {
    return res.render('uploadVideo', { pageTitle: 'Upload Video' });
};

export const postUploadVideo = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try {
        await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect('/');
    } catch (error) {
        console.log(error);
        return res.render('uploadVideo', {
            pageTitle: 'Upload Video',
            errorMessage: 'Upload Failed, Please check the form.',
        });
    }
};

export const watchVideo = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.render('404', { pageTitle: 'Video not Found.' });
    }
    return res.render('watchVideo', { pageTitle: video.title, video });
};

export const getEditVideo = async (req, res) => {
    const {
        params: { id },
    } = req;
    const video = await Video.findById(id);
    if (!video) {
        return res.render('404', { pageTitle: 'Video not Found.' });
    }
    return res.render('editVideo', {
        pageTitle: `Edit ${video.title}`,
        video,
    });
};

export const postEditVideo = async (req, res) => {
    const {
        params: { id },
        body: { title, description, hashtags },
    } = req;
    const video = await Video.exists({ _id: id });
    if (!video) {
        return res.render('404', { pageTitle: 'Video not Found.' });
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });

    return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
    const {
        params: { id },
    } = req;
    await Video.findByIdAndDelete(id);
    return res.redirect('/');
};
