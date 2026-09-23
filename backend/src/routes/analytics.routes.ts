import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller.js';
import { optionalAuthenticateJwt } from '../middleware/auth.js';

const router = Router();

router.get('/overview', optionalAuthenticateJwt, analyticsController.getOverview);
router.get('/states', optionalAuthenticateJwt, analyticsController.getStates);
router.get('/districts', optionalAuthenticateJwt, analyticsController.getDistricts);
router.get('/delay-trends', optionalAuthenticateJwt, analyticsController.getDelayTrends);
router.get('/factors', optionalAuthenticateJwt, analyticsController.getFactors);

export default router;
