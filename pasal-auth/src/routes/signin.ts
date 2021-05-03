import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import {validateRequest} from '../common';
const router = express.Router();

router.get('/api/users/test', async(req:Request, res: Response) => {
    res.send({message: 'This is working fine.'});
});

router.post('/api/users/signin', [], validateRequest, async (req: Request, res:Response) => {
   res.status(200).json({message: 'Hello'})
});

export {router as signInRouter};