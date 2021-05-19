// @ts-nocheck
import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../../common";

export function HasRole(role: object) {
  return function (req: Request, res: Response, next: NextFunction) {
    const { permissions } = req.currentUser;
    if (role) {
      const isAuthorized = role.filter((item) => {
        return permissions.indexOf(item) !== -1;
      });
      if (isAuthorized.length < 1) {
        throw new NotAuthorizedError(
          `Not Authorized, Required following permission ${role.join(", ")}`
        );
      }
      next();
    }
  };
}
