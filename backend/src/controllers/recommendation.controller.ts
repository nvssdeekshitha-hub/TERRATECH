import { Request, Response, NextFunction } from 'express';
import { recommendationService } from '../services/recommendation.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class RecommendationController {
  async getProjectRecommendations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const recommendations = await recommendationService.getProjectRecommendations(id);
      sendSuccess(res, recommendations, 'Project recommendations retrieved successfully', 200);
    } catch (err) {
      next(err);
    }
  }
}

export const recommendationController = new RecommendationController();
