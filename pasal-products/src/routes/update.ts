import express, { Request, Response } from 'express';
import { body }  from 'express-validator'
import { RequestParamHandler } from 'express-serve-static-core';
import { Product } from '../models/products';
import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest  } from '@pasal/common';

const router = express.Router();

router.put('/api/products/v1/:id',
requireAuth,
[
    body('name')
      .isLength({ min: 2, max: 20 })
      .withMessage('Proudct name is required'),
    body('category')
      .isLength({ min: 2, max: 20 })
      .withMessage('Please provide category'),
    body('subCategory')
      .isLength({ min: 2, max: 20 })
      .withMessage('Please provide sub category'),
    body('price')
      .isFloat({ min: 1, max: 10000 })
      .withMessage('Please provide price'),
    body('availableItems')
      .isFloat({ min: 1, max: 10000 })
      .withMessage('Please provided available items'),
  ],
  validateRequest,
async(req: Request, res:Response) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if(!product) {
      throw new NotFoundError();
    }

    if(product.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    product.set({
      name: req.body.name,
      category: req.body.category,
      subCategory: req.body.subCategory,
      price: req.body.price,
      availableItems: req.body.availableItems,
    });

    await product.save();

    res.send(product)
});

export { router as updateProductRouter };