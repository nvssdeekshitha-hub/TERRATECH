import { isDbAvailable, dbQuery } from '../config/database.js';
import { GeoJsonFeature, GeoJsonFeatureCollection, Parcel } from '../models/parcel.model.js';
import { mockStore } from './mockData.store.js';

export interface GisFilterOptions {
  projectId?: string;
  state?: string;
  district?: string;
  riskCategory?: string;
}

export class GisService {
  async getParcelsGeoJson(filters: GisFilterOptions = {}): Promise<GeoJsonFeatureCollection> {
    let parcels: Parcel[] = [];

    if (isDbAvailable()) {
      const conditions: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (filters.projectId) {
        conditions.push(`project_id = $${idx++}`);
        params.push(filters.projectId);
      }
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

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const sql = `SELECT * FROM parcels ${where} ORDER BY risk_score DESC`;
      const res = await dbQuery<Parcel>(sql, params);
      parcels = res.rows;
    } else {
      let list = [...mockStore.parcels];
      if (filters.projectId) {
        list = list.filter(p => p.project_id === filters.projectId);
      }
      if (filters.state) {
        list = list.filter(p => p.state.toLowerCase() === filters.state?.toLowerCase());
      }
      if (filters.district) {
        list = list.filter(p => p.district.toLowerCase() === filters.district?.toLowerCase());
      }
      if (filters.riskCategory) {
        list = list.filter(p => p.risk_category === filters.riskCategory);
      }
      parcels = list;
    }

    const features: GeoJsonFeature[] = parcels.map(parcel => ({
      type: 'Feature',
      geometry: parcel.coordinates_geojson,
      properties: {
        id: parcel.id,
        projectId: parcel.project_id,
        parcelNumber: parcel.parcel_number,
        surveyNumber: parcel.survey_number,
        ownerName: parcel.owner_name,
        landType: parcel.land_type,
        areaSqm: parcel.area_sqm,
        state: parcel.state,
        district: parcel.district,
        riskCategory: parcel.risk_category,
        riskScore: parcel.risk_score,
        delayProbability: parcel.delay_probability,
        estimatedDelayDays: parcel.estimated_delay_days,
        legalDisputes: parcel.legal_disputes,
        compensationStatus: parcel.compensation_status,
        possessionStatus: parcel.possession_status
      }
    }));

    return {
      type: 'FeatureCollection',
      features,
      totalFeatures: features.length
    };
  }
}

export const gisService = new GisService();
