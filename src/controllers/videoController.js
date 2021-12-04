export const home = (req, res) => {
    return res.render('home', { pageTitle: 'Home' });
};

export const search = (req, res) => {
    return res.render('search', { pageTitle: 'Search' });
};

export const uploadVideo = (req, res) => {
    return res.render('uploadVideo', { pageTitle: 'Upload Video' });
};

export const watchVideo = (req, res) => {
    return res.render('watchVideo', { pageTitle: 'Watch Video' });
};

export const editVideo = (req, res) => {
    return res.render('editVideo', { pageTitle: 'Edit Video' });
};

export const deleteVideo = (req, res) => {
    return res.render('deleteVideo', { pageTitle: 'deleteVideo' });
};
