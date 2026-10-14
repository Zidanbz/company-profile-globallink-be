import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message = "Something went wrong",
  code = "INTERNAL_SERVER_ERROR",
  statusCode = 500,
  details?: any
): Response => {
  const payload: ApiResponse = {
    success: false,
    message,
    error: {
      code,
      ...(details ? { details } : {}),
    },
  };
  return res.status(statusCode).json(payload);
};
