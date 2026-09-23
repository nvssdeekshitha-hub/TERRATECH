import { Router } from 'express';
import { parcelController } from '../controllers/parcel.controller.js';
import { optionalAuthenticateJwt } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuthenticateJwt, parcelController.getParcels);
router.get('/:id', optionalAuthenticateJwt, parcelController.getParcelById);

export default router;
