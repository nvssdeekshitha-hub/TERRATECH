import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class AnalyticsController {
  async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getOverview();
      sendSuccess(res, data, 'Analytics overview retrieved successfully', 200);
    } catch (err) {
      next(err);
    }
  }

  async getStates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getStates();
      sendSuccess(res, data, 'State analytics retrieved successfully', 200);
    } catch (err) {
      next(err);
    }
  }

  async getDistricts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getDistricts();
      sendSuccess(res, data, 'District analytics retrieved successfully', 200);
    } catch (err) {
      next(err);
    }
  }

  async getDelayTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getDelayTrends();
      sendSuccess(res, data, 'Delay trends retrieved successfully', 200);
    } catch (err) {
      next(err);
    }
  }

  async getFactors(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await analyticsService.getDelayFactors();
      sendSuccess(res, data, 'Delay factors retrieved successfully', 200);
    } catch (err) {
      next(err);
    }
  }
}

export const analyticsController = new AnalyticsController();
