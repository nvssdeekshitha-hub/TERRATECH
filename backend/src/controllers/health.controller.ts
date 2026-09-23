import { Request, Response } from 'express';
import { isDbAvailable } from '../config/database.js';

export class HealthController {
  check(req: Request, res: Response): void {
    res.status(200).json({
      status: 'ok',
      service: 'TerraTech Backend',
      database: isDbAvailable() ? 'connected' : 'development_fallback',
      timestamp: new Date().toISOString()
    });
  }
}

export const healthController = new HealthController();
