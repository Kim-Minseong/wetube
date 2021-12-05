import Video from '../models/Video';

export const home = async (req, res) => {
    const videos = await Video.find({});
    return res.render('home', { pageTitle: 'Home', videos });
};

export const search = (req, res) => {
    return res.render('search', { pageTitle: 'Search' });
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
            hashtags: hashtags.split(',').map((word) => `#${word}`),
            createdAt,
            meta: {
                views,
                rating,
            },
        });
        return res.redirect('/');
    } catch {
        return res.render('uploadVideo', {
            pageTitle: 'Upload Video',
            errorMessage: 'Upload Failed, Please check the form.',
        });
    }
};

export const watchVideo = (req, res) => {
    const { id } = req.params;
    return res.render('watchVideo', { pageTitle: 'Watch Video' });
};

export const getEditVideo = (req, res) => {
    const { id } = req.params;
    return res.render('editVideo', {
        pageTitle: `Editing Video`,
    });
};

export const postEditVideo = (req, res) => {
    const {
        params: { id },
        body: { title, description },
    } = req;
    return res.redirect(`/`);
};

export const deleteVideo = (req, res) => {
    return res.render('deleteVideo', { pageTitle: 'deleteVideo' });
};
