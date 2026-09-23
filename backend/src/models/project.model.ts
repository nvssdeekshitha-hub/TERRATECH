export type RiskCategory = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ProjectStatus = 'PLANNED' | 'IN_PROGRESS' | 'DELAYED' | 'COMPLETED' | 'HALTED';

export interface Project {
  id: string;
  name: string;
  code: string;
  project_type: string;
  state: string;
  district: string;
  total_land_area_ha: number;
  budget_cr: number;
  affected_families: number;
  status: ProjectStatus;
  risk_score: number;
  risk_category: RiskCategory;
  delay_probability: number;
  estimated_delay_days: number;
  primary_delay_factors?: string[];
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface ProjectSummaryStats {
  totalParcels: number;
  criticalParcels: number;
  highRiskParcels: number;
  mediumRiskParcels: number;
  lowRiskParcels: number;
  disputedParcels: number;
  compensationPendingParcels: number;
  totalAreaSqm: number;
}

export interface ProjectDetailResponse extends Project {
  stats?: ProjectSummaryStats;
}
