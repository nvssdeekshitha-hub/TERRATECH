import { Router } from 'express';
import authRoutes from './auth.routes.js';
import projectRoutes from './project.routes.js';
import parcelRoutes from './parcel.routes.js';
import predictionRoutes from './prediction.routes.js';
import analyticsRoutes from './analytics.routes.js';
import gisRoutes from './gis.routes.js';
import alertRoutes from './alert.routes.js';
import recommendationRoutes from './recommendation.routes.js';
import healthRoutes from './health.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/parcels', parcelRoutes);
apiRouter.use('/predictions', predictionRoutes);
apiRouter.use('/analytics', analyticsRoutes);
apiRouter.use('/gis', gisRoutes);
apiRouter.use('/alerts', alertRoutes);
apiRouter.use('/recommendations', recommendationRoutes);

export default apiRouter;
