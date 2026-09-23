import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../utils/validationSchemas.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

router.post('/register', authLimiter, validateRequest({ body: registerSchema }), authController.register);
router.post('/login', authLimiter, validateRequest({ body: loginSchema }), authController.login);
router.get('/me', authenticateJwt, authController.me);

export default router;
