export const home = (req, res) => {
    return res.render('home', { pageTitle: 'Home' });
};

export const search = (req, res) => {
    return res.render('search', { pageTitle: 'Search' });
};

export const getUploadVideo = (req, res) => {
    return res.render('uploadVideo', { pageTitle: 'Upload Video' });
};

export const postUploadVideo = (req, res) => {
    const { title, description } = req.body;
    return res.redirect('/');
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
