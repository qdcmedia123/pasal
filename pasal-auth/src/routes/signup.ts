import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/user";
import { validateRequest, BadRequestError } from "../common";
import jwt from "jsonwebtoken";
import { checkPermissionAllSet } from "./utils";

const router = express.Router();

router.get("/api/users/test", async (req: Request, res: Response) => {
  res.send("All is good");
});
router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 2 to 20 char"),
    body("usertype").trim().isIn(["seller", "buyer"]),
    body("permissions")
      .isArray()
      .notEmpty()
      .withMessage("Please provide at least a permission to user"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, usertype, permissions } = req.body;
    const existingUser = await User.findOne({ email, usertype });

    if (existingUser) {
      throw new BadRequestError("Email address already exists");
    }

    let selectedPermissionExists = await checkPermissionAllSet(permissions);

    if (!selectedPermissionExists.status) {
      throw new BadRequestError(
        `Error ${selectedPermissionExists.permissions}`
      );
    }

    const user = User.build({ email, password, usertype, permissions });
    await user.save();

    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
        usertype: user.usertype,
        permissions: permissions,
      },
      process.env.JWT_KEY!
    );
    
    req.session = {
      jwt: userJWT,
    };
    res.status(201).send(user);
  }
);

export { router as signupRouter };
