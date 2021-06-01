import express, {Request, Response} from 'express';

const router = express.Router();

router.get('/api/users/signout', async(req:Request, res:Response) => {
    req.session = null;
    res.send({});
});

export {router as signoutRouter};