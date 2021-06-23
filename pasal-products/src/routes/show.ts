import { NotFoundError } from '@pasal/common';
import express, { Request, Response } from 'express';
import { Product } from "../models/products";

const router = express.Router();

router.get("/api/products/v1/:id", async(req: Request, res:Response) => {
    const products = await Product.findById(req.params.id);

    if(!products) {
        throw new NotFoundError();
    }

    res.send(products);
});

export { router as showProductRouter };