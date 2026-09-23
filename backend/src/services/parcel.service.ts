import { isDbAvailable, dbQuery } from '../config/database.js';
import { Parcel } from '../models/parcel.model.js';
import { RiskCategory } from '../models/project.model.js';
import { mockStore } from './mockData.store.js';
import { AppError } from '../middleware/errorHandler.js';

export interface ParcelFilters {
  state?: string;
  district?: string;
  riskCategory?: RiskCategory;
  project?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class ParcelService {
  async getParcels(filters: ParcelFilters = {}) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, Math.min(200, filters.limit || 20));
    const offset = (page - 1) * limit;

    if (isDbAvailable()) {
      const conditions: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (filters.state) {
        conditions.push(`state = $${idx++}`);
        params.push(filters.state);
      }
      if (filters.district) {
        conditions.push(`district = $${idx++}`);
        params.push(filters.district);
      }
      if (filters.riskCategory) {
        conditions.push(`risk_category = $${idx++}`);
        params.push(filters.riskCategory);
      }
      if (filters.project) {
        conditions.push(`project_id = $${idx++}`);
        params.push(filters.project);
      }
      if (filters.status) {
        conditions.push(`possession_status = $${idx++}`);
        params.push(filters.status);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countSql = `SELECT COUNT(*) FROM parcels ${whereClause}`;
      const countRes = await dbQuery<{ count: string }>(countSql, params);
      const total = parseInt(countRes.rows[0].count, 10);

      const querySql = `
        SELECT * FROM parcels
        ${whereClause}
        ORDER BY risk_score DESC, created_at DESC
        LIMIT $${idx++} OFFSET $${idx++}
      `;
      const dataRes = await dbQuery<Parcel>(querySql, [...params, limit, offset]);

      return {
        parcels: dataRes.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } else {
      let list = [...mockStore.parcels];

      if (filters.state) {
        list = list.filter(p => p.state.toLowerCase() === filters.state?.toLowerCase());
      }
      if (filters.district) {
        list = list.filter(p => p.district.toLowerCase() === filters.district?.toLowerCase());
      }
      if (filters.riskCategory) {
        list = list.filter(p => p.risk_category === filters.riskCategory);
      }
      if (filters.project) {
        list = list.filter(p => p.project_id === filters.project);
      }
      if (filters.status) {
        list = list.filter(p => p.possession_status === filters.status);
      }

      list.sort((a, b) => b.risk_score - a.risk_score);

      const total = list.length;
      const paginated = list.slice(offset, offset + limit);

      return {
        parcels: paginated,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    }
  }

  async getParcelById(id: string): Promise<Parcel> {
    if (isDbAvailable()) {
      const res = await dbQuery<Parcel>('SELECT * FROM parcels WHERE id = $1 LIMIT 1', [id]);
      if (res.rows.length === 0) {
        throw new AppError(`Parcel with ID '${id}' not found`, 404);
      }
      return res.rows[0];
    } else {
      const found = mockStore.parcels.find(p => p.id === id);
      if (!found) {
        throw new AppError(`Parcel with ID '${id}' not found`, 404);
      }
      return found;
    }
  }
}

export const parcelService = new ParcelService();
