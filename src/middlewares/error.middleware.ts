import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { env } from "../config/env";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  console.error("[ServerError]:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || "INTERNAL_SERVER_ERROR";

  const details = env.NODE_ENV === "development" ? { stack: err.stack } : undefined;

  sendError(res, message, code, statusCode, details);
};
