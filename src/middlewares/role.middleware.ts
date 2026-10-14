import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, "Autentikasi diperlukan", "UNAUTHORIZED", 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, "Akses dilarang untuk role ini", "FORBIDDEN", 403);
      return;
    }

    next();
  };
};
