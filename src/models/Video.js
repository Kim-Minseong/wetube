import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true },
    thumbUrl: { type: String, required: true },
    description: { type: String, required: true, trim: true },
    hashtags: [{ type: String, trim: true }],
    createdAt: { type: Date, default: Date.now, required: true },
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0, required: true },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

videoSchema.static('formatHashtags', function (hashtags) {
    return hashtags
        .split(',')
        .map((word) => (word.startsWith('#') ? word : `#${word}`));
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
