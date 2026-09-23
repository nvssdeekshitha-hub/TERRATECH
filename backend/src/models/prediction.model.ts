import { RiskCategory } from './project.model.js';

export interface PredictionInputFeatures {
  project_id?: string;
  parcel_id?: string;
  project_type: string;
  state: string;
  district: string;
  land_area_sqm: number;
  affected_families?: number;
  ownership_complexity: string;
  documentation_status: string;
  legal_disputes: string;
  compensation_status: string;
  approval_status: string;
  rehabilitation_status: string;
  possession_status: string;
  stakeholder_responsiveness: string;
  administrative_processing_days?: number;
  historical_district_delay_rate?: number;
}

export interface FactorContribution {
  factor: string;
  weight: number;
  impact: 'INCREASES_DELAY' | 'DECREASES_DELAY' | 'NEUTRAL';
  description: string;
}

export interface PredictionResult {
  delay_probability: number;
  risk_score: number;
  risk_category: RiskCategory;
  estimated_delay_days: number;
  explainable_ai?: {
    method: string;
    factor_contributions: FactorContribution[];
    summary: string;
  };
  recommendations?: string[];
  is_simulated_fallback?: boolean;
}
