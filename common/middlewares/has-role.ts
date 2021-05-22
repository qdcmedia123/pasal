// @ts-nocheck
import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "..";

export function hasRole(role: object) {
  return function (req: Request, res: Response, next: NextFunction) {
    if(req.currentUser) {
        const permissions = req.currentUser?.permissions;
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
    
}
