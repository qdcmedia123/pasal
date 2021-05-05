import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {validateRequest} from '@wealthface/common';
const router = express.Router();


router.post('/api/users/signin', [body('email')
.isEmail()
.withMessage('Email must be valid')
], validateRequest, async (req: Request, res:Response) => {
   res.status(200).json({message: 'Hello'})
});

export {router as signInRouter};