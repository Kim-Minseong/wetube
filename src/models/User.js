import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    username: { type: String, lowercase: true, required: true },
    password: { type: String, required: false },
    socialOnly: { type: Boolean, default: false },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

userSchema.static('hashPassword', async function (password) {
    const completeHashingPassword = await bcrypt.hash(password, 5);
    return completeHashingPassword;
});

const User = mongoose.model('User', userSchema);

export default User;
