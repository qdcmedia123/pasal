import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@pasal/common';
import { createProductRouter } from './routes/new';
import { indexProductRouter  } from './routes';
import { showProductRouter  } from './routes/show';
import { updateProductRouter } from './routes/update';

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
app.use(createProductRouter);
app.use(indexProductRouter);
app.use(showProductRouter);
app.use(updateProductRouter);
app.all('*', async(req, res) => {
    res.end('Not found');
});


app.all('*', async (req, res) => {
    throw new NotFoundError();
  });

app.use(errorHandler);
  
export {app};