import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {User} from '../models/user';
import {} from '../common/errors/bad-request-error';
import {validateRequest, BadRequestError} from '../common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signup', [
    body('email')
     .isEmail()
     .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({min:4, max:20})
      .withMessage('Password must be between 2 to 20 char')
], validateRequest, async(req: Request, res:Response) => {
    const {email, password} = req.body;
    const existingUser = await User.findOne({email});

    if(existingUser) {
        throw new BadRequestError('Email address already exists')
    }
    res.status(201).send({existingUser})
});

export {router as signUpRouter}