import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import {signInRouter} from './routes/signin';
import {signupRouter} from './routes/signup';
import {permissionRouter} from './routes/permission';
import {resetPasswordRouter} from './routes/reset-password';
import { errorHandler, NotFoundError, currentUser } from '@pasal/common';
import {currentUserRouter} from './routes/current-user';


const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed:false,
        secure: process.env.NODE_ENV !== 'test',
    })
);

app.use(currentUser);
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signupRouter);
app.use(resetPasswordRouter);
app.use(permissionRouter);
app.all('*', async(req, res) => {
    res.end('Not found');
});

app.all('*', async (req, res) => {
    throw new NotFoundError();
  });

app.use(errorHandler);
  
export {app};