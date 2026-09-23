import { Request, Response, NextFunction } from 'express';
import { alertService } from '../services/alert.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class AlertController {
  async getAlerts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        projectId: req.query.projectId as string,
        severity: req.query.severity as any,
        isRead: req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined
      };

      const alerts = await alertService.getAlerts(filters);
      sendSuccess(res, alerts, 'Alerts retrieved successfully', 200);
    } catch (err) {
      next(err);
    }
  }

  async createAlert(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newAlert = await alertService.createAlert(req.body);
      sendSuccess(res, newAlert, 'Alert created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await alertService.markAsRead(id);
      sendSuccess(res, updated, 'Alert marked as read', 200);
    } catch (err) {
      next(err);
    }
  }
}

export const alertController = new AlertController();
