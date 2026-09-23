import { Router } from 'express';
import { predictionController } from '../controllers/prediction.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { predictionInputSchema } from '../utils/validationSchemas.js';
import { predictionLimiter } from '../middleware/rateLimiter.js';
import { optionalAuthenticateJwt } from '../middleware/auth.js';

const router = Router();

router.post(
  '/',
  predictionLimiter,
  optionalAuthenticateJwt,
  validateRequest({ body: predictionInputSchema }),
  predictionController.predict
);

export default router;
