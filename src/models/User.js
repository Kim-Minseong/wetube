import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, lowercase: true, required: true },
    password: { type: String, required: false },
    socialOnly: { type: Boolean, default: false },
});

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model('User', userSchema);

export default User;
