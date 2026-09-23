import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | Record<string, unknown> | unknown[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200,
  pagination?: ApiResponse<T>['pagination']
): Response => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  if (pagination) {
    payload.pagination = pagination;
  }

  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  error: string | Record<string, unknown> | unknown[],
  statusCode: number = 500,
  message: string = 'An error occurred'
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
    timestamp: new Date().toISOString()
  });
};
