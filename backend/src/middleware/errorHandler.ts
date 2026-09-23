import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/apiResponse.js';

export class AppError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode: number = 400, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  logger.error(`[Error Middleware] ${req.method} ${req.originalUrl}:`, err);

  // 1. Zod Validation Error
  if (err instanceof ZodError) {
    const formattedIssues = err.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    sendError(res, formattedIssues, 400, 'Validation failed');
    return;
  }

  // 2. Custom AppError
  if (err instanceof AppError) {
    sendError(res, err.details ? (err.details as Record<string, unknown>) : err.message, err.statusCode, err.message);
    return;
  }

  // 3. JWT Authentication Errors
  if (typeof err === 'object' && err !== null && 'name' in err) {
    const errorName = (err as { name: string }).name;
    if (errorName === 'TokenExpiredError') {
      sendError(res, 'Authentication token expired. Please log in again.', 401, 'Unauthorized');
      return;
    }
    if (errorName === 'JsonWebTokenError') {
      sendError(res, 'Invalid authentication token.', 401, 'Unauthorized');
      return;
    }
  }

  // 4. Default 500 Internal Server Error
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  sendError(res, message, 500, 'An unexpected server error occurred');
};
