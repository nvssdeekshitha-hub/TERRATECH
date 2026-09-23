import { PredictionResponse } from './predict';

export type RiskCategory = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ProjectStatus = 'PLANNING' | 'IN_PROGRESS' | 'DELAYED' | 'CRITICAL_HALT' | 'COMPLETED';

export interface OperationalStatus {
  ownership_complexity: number;
  documentation_completeness: number;
  legal_dispute: number; // 0 or 1
  compensation_status: number;
  approval_status: number;
  rehabilitation_status: number;
  possession_status: number;
  stakeholder_responsiveness: number;
  administrative_processing_days: number;
  historical_delay_rate: number;
}

export interface Milestone {
  id: string;
  name: string;
  targetDate: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'OVERDUE';
  completionPercentage: number;
}

export interface Alert {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  category: 'LEGAL' | 'R_AND_R' | 'FINANCIAL' | 'APPROVAL' | 'COMMUNITY';
  createdAt: string;
  isResolved: boolean;
}

export interface Recommendation {
  id: string;
  projectId: string;
  projectName: string;
  category: string;
  action: string;
  impactDelayReductionDays: number;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM';
  status: 'PROPOSED' | 'IN_IMPLEMENTATION' | 'RESOLVED';
}

export interface Project {
  id: string;
  name: string;
  project_type: string;
  state: string;
  district: string;
  land_area_acres: number;
  affected_families: number;
  budget_crores: number;
  target_completion_date: string;
  status: ProjectStatus;
  coordinates: {
    lat: number;
    lng: number;
  };
  operational_status: OperationalStatus;
  prediction?: PredictionResponse;
  milestones: Milestone[];
  alerts: Alert[];
  recommendations: Recommendation[];
}
