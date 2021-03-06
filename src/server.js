import express from 'express';
import morgan from 'morgan';
import globalRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import flash from 'express-flash';
import apiRouter from './routers/apiRouter';
import session from 'express-session';
import { localsMiddleware } from './middleWares';
import MongoStore from 'connect-mongo';

const app = express();
const logger = morgan('dev');

// MiddleWares
app.use(logger);
app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());
app.use(localsMiddleware);

// Router
app.use('/uploads', express.static(process.cwd() + '/uploads'));
app.use('/static', express.static(process.cwd() + '/assets'));

app.use('/', globalRouter);
app.use('/users', userRouter);
app.use('/videos', videoRouter);
app.use('/api', apiRouter);

export default app;
