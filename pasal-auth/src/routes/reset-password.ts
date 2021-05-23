import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {validateRequest} from '@pasal/common';
const router = express.Router();

router.post('/api/users/reset_password', 
[
    body('email')
     .isEmail()
     .withMessage('Please provide email address')
],
validateRequest, async(req: Request, res:Response) => {
    res.status(201).json({message: 'Password request is created'});
});

export {router as resetPasswordRouter}