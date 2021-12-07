import express from 'express';
import morgan from 'morgan';
import globalRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import session from 'express-session';
import { localsMiddleware } from './middleWares';
import MongoStore from 'connect-mongo';

const app = express();
const logger = morgan('dev');

// MiddleWares
app.use(logger);
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
        resave: false,
        saveUninitialized: false,
    })
);
app.use(localsMiddleware);

// Router
app.use('/', globalRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);

export default app;
