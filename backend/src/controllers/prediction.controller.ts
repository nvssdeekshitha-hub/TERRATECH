import { Request, Response, NextFunction } from 'express';
import { mlService } from '../services/ml.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class PredictionController {
  async predict(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await mlService.predictDelay(req.body);
      sendSuccess(res, result, 'Prediction generated successfully', 200);
    } catch (err) {
      next(err);
    }
  }
}

export const predictionController = new PredictionController();
