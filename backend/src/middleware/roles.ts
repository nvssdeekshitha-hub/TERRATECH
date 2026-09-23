import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/user.model.js';
import { AppError } from './errorHandler.js';

export const requireRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('User authentication required before role authorization.', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        `Access denied. Role '${req.user.role}' is not authorized to access this resource. Required: [${allowedRoles.join(', ')}]`,
        403
      );
    }

    next();
  };
};
