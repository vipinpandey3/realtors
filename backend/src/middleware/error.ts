import { NextFunction, Request, Response } from "express";

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  if (err?.status && err?.message) {
    return res.status(err.status).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal Server Error" });
}

const createAppError = (message: string, statusCode: number): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = createAppError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};
