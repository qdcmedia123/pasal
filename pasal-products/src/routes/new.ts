//@ts-nocheck
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, requireAuth, hasRole } from "@pasal/common";
import { Product } from "../models/products";
import { ProductCreatedPublisher } from "../events/publishers/product-created-publishere";
import { rabbitMQWrapper } from "../rabbitmq-wrapper";
const router = express.Router();

router.get("/api/products/v1/test", async(req, res) => {
  res.send('Test is working');
  // Hello
});

router.post(
  "/api/products/v1/new",
  requireAuth,
  hasRole(["create_product"]),
  [
    body("name")
      .isLength({ min: 2, max: 20 })
      .withMessage("Proudct name is required"),
    body("category")
      .isLength({ min: 2, max: 20 })
      .withMessage("Please provide category"),
    body("subCategory")
      .isLength({ min: 2, max: 20 })
      .withMessage("Please provide sub category"),
    body("price")
      .isFloat({ min: 1, max: 10000 })
      .withMessage("Please provide price"),
    body("availableItems")
      .isFloat({ min: 1, max: 10000 })
      .withMessage("Please provided available items"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, price, category, subCategory, availableItems } = req.body;
    const product = Product.build({
      name,
      price,
      category,
      subCategory,
      availableItems,
      userId: req.currentUser!.id,
    });
    await product.save();
    
    new ProductCreatedPublisher(rabbitMQWrapper.client).publish({
      version: product.version,
      id: product.id,
      userId: product.userId,
      name: product.name,
      availableItems:availableItems
    });
    
    res.status(201).json(product);
  }
);

export { router as createProductRouter };
