import { Request, Response, NextFunction } from 'express';
import { gisService } from '../services/gis.service.js';

export class GisController {
  async getParcelsGeoJson(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        projectId: req.query.projectId as string,
        state: req.query.state as string,
        district: req.query.district as string,
        riskCategory: req.query.riskCategory as string
      };

      const geoJson = await gisService.getParcelsGeoJson(filters);
      // Return raw GeoJSON FeatureCollection directly for Leaflet / GIS client consumption
      res.status(200).json(geoJson);
    } catch (err) {
      next(err);
    }
  }
}

export const gisController = new GisController();
