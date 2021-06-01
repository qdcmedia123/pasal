import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@pasal/common";
import { User } from "../models/user";
import { ResetPassword } from "../models/resetpassword";
import mongoose from "mongoose";
import { Password } from "../services/password";
const router = express.Router();

router.post(
  "/api/users/request_reset_password",
  [body("email").isEmail().withMessage("Please provide email address")],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError(`Can not find the user with email ${email}`);
    }
    const resetPassword = ResetPassword.build({
      user_id: user.id,
      code: new mongoose.mongo.ObjectId().toHexString(),
    });
    res.status(201).json(resetPassword);
  }
);

router.post(
  "/api/users/updated_password",
  [
    body("code")
      .isLength({ min: 24, max: 24 })
      .withMessage("Please provide valid id"),
    body("user_id")
      .isLength({ min: 24, max: 24 })
      .withMessage("Please provide valid id"),
    body("password")
      .isLength({ min: 4, max: 28 })
      .withMessage("Please enter the password")
      .custom((value, { req, path }) => {
        if (value !== req.body.confirmPassword) {
          throw new BadRequestError("Both password did not match");
        } else {
          return true;
        }
      }),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    
    const { code, user_id, password } = req.body;
    
    const isValid = await ResetPassword.findOne({
      user_id: user_id,
      code: code,
      expire_at: { $lt: new Date() },
    });
    
    if (isValid) {
      throw new BadRequestError(`Invalid code or code has been expired`);
    }
    
    const user = await User.findById(user_id);
   
    if (!user) {
      throw new BadRequestError("Unable find the user");
    }
    
    const hashedPassword = await Password.toHash(password);
    
    try {
      const updatePassword = await User.findOneAndUpdate(
        { _id: user_id },
        { $set: { password: hashedPassword } },
        { new: true, useFindAndModify: false }
      );
      if (!updatePassword) {
        throw new Error(`Unable to update the password`);
      }
      return res.status(204).json({ message: "Password updated sucessfully" });
    } catch (err) {
      return res.status(500).json({ err });
    }
  }
);

export { router as resetPasswordRouter };
