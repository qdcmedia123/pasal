import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, requireAuth, hasRole } from "@pasal/common";
const router = express.Router();

router.post(
  "/api/products/v1/new",
  requireAuth,
  hasRole(["create_product"]),
   [ 
      body("name")
      .isLength({ min: 2, max: 20 })
      .withMessage("Proudct name is required"),
   ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello" });
  }
);

export { router as createProductRouter };
