export interface PredictionRequest {
  project_type: string;
  state: string;
  district: string;
  land_area_acres: number;
  affected_families: number;
  ownership_complexity: number;
  documentation_completeness: number;
  legal_dispute: number;
  compensation_status: number;
  approval_status: number;
  rehabilitation_status: number;
  possession_status: number;
  stakeholder_responsiveness: number;
  administrative_processing_days: number;
  historical_delay_rate: number;
}

export interface DelayFactor {
  feature: string;
  transformed_feature: string;
  impact_score: number;
  current_value: string;
  description: string;
}

export interface PredictionResponse {
  delay_probability: number;
  risk_score: number;
  risk_category: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimated_delay_days: number;
  delay_factors: DelayFactor[];
  corrective_recommendations: string[];
  model_version: string;
}
