import { RiskCategory } from './project.model.js';

export interface GeoJsonGeometry {
  type: 'Point' | 'Polygon' | 'MultiPolygon';
  coordinates: number[] | number[][] | number[][][];
}

export interface Parcel {
  id: string;
  project_id: string;
  parcel_number: string;
  survey_number: string;
  owner_name: string;
  land_type: string;
  area_sqm: number;
  state: string;
  district: string;
  ownership_complexity: string;
  documentation_status: string;
  legal_disputes: string;
  compensation_status: string;
  approval_status: string;
  rehabilitation_status: string;
  possession_status: string;
  stakeholder_responsiveness: string;
  risk_category: RiskCategory;
  risk_score: number;
  delay_probability: number;
  estimated_delay_days: number;
  coordinates_geojson: GeoJsonGeometry;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface GeoJsonFeature {
  type: 'Feature';
  geometry: GeoJsonGeometry;
  properties: {
    id: string;
    projectId: string;
    parcelNumber: string;
    surveyNumber: string;
    ownerName: string;
    landType: string;
    areaSqm: number;
    state: string;
    district: string;
    riskCategory: RiskCategory;
    riskScore: number;
    delayProbability: number;
    estimatedDelayDays: number;
    legalDisputes: string;
    compensationStatus: string;
    possessionStatus: string;
  };
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
  totalFeatures: number;
}
