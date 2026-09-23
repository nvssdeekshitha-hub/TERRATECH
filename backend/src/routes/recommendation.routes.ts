import { Router } from 'express';
import { recommendationController } from '../controllers/recommendation.controller.js';
import { optionalAuthenticateJwt } from '../middleware/auth.js';

const router = Router();

// Also accessible via /api/recommendations/:projectId or nested under /api/projects/:id/recommendations
router.get('/:projectId', optionalAuthenticateJwt, (req, res, next) => {
  req.params.id = req.params.projectId;
  recommendationController.getProjectRecommendations(req, res, next);
});

export default router;
