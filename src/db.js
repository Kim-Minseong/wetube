import mongoose from 'mongoose';

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleConnect = () => {
    console.log('✅ Connected to DB');
};

const handleError = (error) => {
    console.log("❗️ DB Error'", error);
};

db.on('error', handleError);
db.once('open', handleConnect);
