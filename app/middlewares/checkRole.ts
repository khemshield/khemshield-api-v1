// src/middlewares/checkRole.ts
import { Request, Response, NextFunction } from "express";
import { UserRole } from "../modules/user/user.model";

/**
 * Middleware to restrict access based on user role(s)
 * @param roles One or more roles that are allowed
 */
export const checkRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.roles.some((role) => roles.includes(role))) {
      return res.status(403).json({
        message: `Access denied: only ${roles} can perform this action.`,
      });
    }

    next();
  };
};
