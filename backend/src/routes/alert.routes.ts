import { Router } from 'express';
import { alertController } from '../controllers/alert.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { createAlertSchema } from '../utils/validationSchemas.js';
import { authenticateJwt, optionalAuthenticateJwt } from '../middleware/auth.js';
import { requireRoles } from '../middleware/roles.js';

const router = Router();

router.get('/', optionalAuthenticateJwt, alertController.getAlerts);
router.post(
  '/',
  authenticateJwt,
  requireRoles('ADMIN', 'OFFICER'),
  validateRequest({ body: createAlertSchema }),
  alertController.createAlert
);
router.put('/:id/read', optionalAuthenticateJwt, alertController.markAsRead);

export default router;
