import { Router } from 'express';
import { gisController } from '../controllers/gis.controller.js';
import { optionalAuthenticateJwt } from '../middleware/auth.js';

const router = Router();

router.get('/parcels', optionalAuthenticateJwt, gisController.getParcelsGeoJson);

export default router;
