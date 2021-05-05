import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import {signInRouter} from './routes/signin';
import {signupRouter} from './routes/signup';
import { errorHandler, NotFoundError } from './common';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed:false,
        secure: process.env.NODE_ENV !== 'test',
    })
);

app.use(signInRouter);
app.use(signupRouter);
app.all('*', async(req, res) => {
    res.end('Not found');
});

app.all('*', async (req, res) => {
    throw new NotFoundError();
  });

app.use(errorHandler);
  
export {app};