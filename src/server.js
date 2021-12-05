import 'dotenv/config';
import './db';
import './models/Video';
import express from 'express';
import morgan from 'morgan';
import globalRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';

const PORT = 3000;

const app = express();
const logger = morgan('dev');

// MiddleWares
app.use(logger);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: true }));

// Router
app.use('/', globalRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

const handleListening = () => {
    console.log(`✅ Server listening at http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
