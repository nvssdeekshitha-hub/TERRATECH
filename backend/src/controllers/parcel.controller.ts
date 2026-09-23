import { Request, Response, NextFunction } from 'express';
import { parcelService, ParcelFilters } from '../services/parcel.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class ParcelController {
  async getParcels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: ParcelFilters = {
        state: req.query.state as string,
        district: req.query.district as string,
        riskCategory: req.query.riskCategory as any,
        project: req.query.project as string,
        status: req.query.status as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20
      };

      const result = await parcelService.getParcels(filters);
      sendSuccess(res, result.parcels, 'Parcels retrieved successfully', 200, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      });
    } catch (err) {
      next(err);
    }
  }

  async getParcelById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const parcel = await parcelService.getParcelById(id);
      sendSuccess(res, parcel, 'Parcel details retrieved successfully', 200);
    } catch (err) {
      next(err);
    }
  }
}

export const parcelController = new ParcelController();
