import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { recommendationController } from '../controllers/recommendation.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema } from '../utils/validationSchemas.js';
import { authenticateJwt, optionalAuthenticateJwt } from '../middleware/auth.js';
import { requireRoles } from '../middleware/roles.js';

const router = Router();

router.get('/', optionalAuthenticateJwt, projectController.getProjects);
router.get('/:id', optionalAuthenticateJwt, projectController.getProjectById);
router.post(
  '/',
  authenticateJwt,
  requireRoles('ADMIN', 'OFFICER'),
  validateRequest({ body: createProjectSchema }),
  projectController.createProject
);
router.put(
  '/:id',
  authenticateJwt,
  requireRoles('ADMIN', 'OFFICER'),
  validateRequest({ body: updateProjectSchema }),
  projectController.updateProject
);

// Recommendation nested route: GET /api/projects/:id/recommendations
router.get('/:id/recommendations', optionalAuthenticateJwt, recommendationController.getProjectRecommendations);

export default router;
