import express, {Request, response, Response} from 'express';
import {body} from 'express-validator';
import {User} from '../models/user';
import {} from '../common/errors/bad-request-error';
import {validateRequest, BadRequestError} from '../common';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get('/api/users/test', async(req: Request, res: Response) => {
  res.send('All is good');
})
router.post('/api/users/signup', [
    body('email')
     .isEmail()
     .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({min:4, max:20})
      .withMessage('Password must be between 2 to 20 char'),
    body('usertype')
      .trim()
      .isIn(['seller', 'buyer'])

], validateRequest, async(req: Request, res:Response) => {
    const {email, password, usertype} = req.body;
    const existingUser = await User.findOne({email, usertype});

    if(existingUser) {
        throw new BadRequestError('Email address already exists')
    }

    const user = User.build({email, password, usertype});
    await user.save();

    const userJWT = jwt.sign({
        id: user.id,
        email: user.email,
        usertype: user.usertype
    }, process.env.JWT_KEY!);
    
    req.session = {
        jwt: userJWT
    }
    res.status(201).send(user);
});

export {router as signupRouter}