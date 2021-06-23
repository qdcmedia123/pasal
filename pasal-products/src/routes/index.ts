import express, { Request, Response } from 'express';
import { Product } from "../models/products";

const router = express.Router();
const limit = 20;

router.get("/api/products/v1", async(req: Request, res:Response) => {
    const skip = 0;
    const products = await Product.find({}).skip(skip).limit(limit);
    res.send(products);
});

export { router as indexProductRouter };