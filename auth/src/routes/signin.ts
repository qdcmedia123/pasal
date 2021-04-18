import express, {Request, Response} from 'express';
import {body} from 'express-validator';
const router = express.Router();

router.get('/api/users/test', async(req:Request, res: Response) => {
    res.send({message: 'This is working fine.'});
});

export {router as signInRouter};