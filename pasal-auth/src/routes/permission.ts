import express, { Request, response, Response } from "express";
import { body } from "express-validator";
import { Permission } from "../models/permissions";
import { validateRequest, BadRequestError } from "@pasal/common";

const router = express.Router();

router.get(
  "/api/users/permission/create",
  async (req: Request, res: Response) => {
    res.status(200).json({ message: "all is good" });
  }
);
router.post(
  "/api/users/permission/create",
  [
    body("name")
      .isLength({ min: 2, max: 20 })
      .withMessage("Permission name is required"),
    body("cat")
      .isLength({ min: 2, max: 20 })
      .withMessage("Permission category is required"),
    body("guard_name")
      .isLength({ min: 2, max: 20 })
      .withMessage("Permission guard name is required"),
    body("role")
      .isLength({ min: 2, max: 20 })
      .withMessage("Permission role is required"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
   
    const { name, cat, guard_name, role } = req.body;

    const existingPermission = await Permission.findOne({ name, cat });

    if (existingPermission) {
      throw new BadRequestError(
        `Permission ${name} already exists with category ${cat}`
      );
    }

    const permission = Permission.build({
      name,
      cat,
      guard_name,
      role,
    });
    await permission.save();

    res.status(200).json({ permission });
  }
);

export { router as permissionRouter };
