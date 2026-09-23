import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env.js';
import { standardLimiter } from './middleware/rateLimiter.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';
import { swaggerSpec } from './config/swagger.js';
import apiRouter from './routes/index.js';

export const createApp = (): Express => {
  const app: Express = express();

  // 1. Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false // Allow Swagger UI inline assets
    })
  );

  // 2. CORS configuration
  app.use(
    cors({
      origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(','),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  // 3. Request Logging (disabled in test)
  if (!config.isTest) {
    app.use(morgan('combined'));
  }

  // 4. Rate Limiting & Body Parsing
  app.use(standardLimiter);
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 5. Swagger / OpenAPI Documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // 6. Base Root Welcome / Redirection
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Welcome to TerraTech Backend API',
      version: '1.0.0',
      documentation: '/api/docs',
      health: '/api/health'
    });
  });

  // 7. Mount Core REST API
  app.use('/api', apiRouter);

  // 8. 404 Not Found Handler
  app.use((req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Endpoint ${req.method} ${req.originalUrl} not found`, 404));
  });

  // 9. Centralized Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp;
