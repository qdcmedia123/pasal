import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {validateRequest, BadRequestError} from '@pasal/common';
import { User } from "../models/user";
import {ResetPassword} from '../models/resetpassword';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/api/users/request_reset_password', 
[
    body('email')
     .isEmail()
     .withMessage('Please provide email address')
],
validateRequest, async(req: Request, res:Response) => {
    // Get the email from the body
    const {email} = req.body;

    // Check ifemail is exists or not
    const user = await User.findOne({email});

    // Throw bad request error if user not found 
    if(!user) {
        throw new BadRequestError(`Can not find the user with email ${email}`);
    }
    
    const resetPassword = ResetPassword.build({
        user_id: user.id,
        code: new mongoose.mongo.ObjectId().toHexString()
    });

    res.status(201).json(resetPassword);
});

router.post('/api/users/updated_password', 
[
    body('code')
    .isLength({min: 24, max: 24})
    .withMessage('Please provide valid id')
],
validateRequest,
async(req: Request, res: Response) => {
    const {code} = req.body;
    // Check the code is exist and expire at is not after 8 hr 
    const isValid = await ResetPassword.findOne({code: code, expire_at: {$lt: new Date()}});

    if(isValid) {
        throw new BadRequestError(`Invalid code or code has been expired`);
    }
    // Otherwise update the password
    res.status(204).json({message: 'Password updated sucessfully'});
});

export {router as resetPasswordRouter}