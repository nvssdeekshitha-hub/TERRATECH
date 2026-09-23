export type RiskCategory = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type AcquisitionStatus = 
  | 'Section 4 Notification' 
  | 'Joint Verification Survey' 
  | 'Valuation & Award' 
  | 'Compensation Disbursement' 
  | 'Rehabilitation & Resettlement' 
  | 'Physical Possession';

export interface GeoJSONPolygonGeometry {
  type: 'Polygon';
  coordinates: number[][][]; // [longitude, latitude]
}

export interface LandParcel {
  id: string; // e.g. "P001"
  project: string; // e.g. "NH-65 Expressway Expansion"
  projectType: 'Highway' | 'Railway' | 'Metro' | 'Industrial' | 'Energy';
  district: string; // e.g. "Vijayawada"
  state: string; // e.g. "Andhra Pradesh"
  tehsilVillage?: string;
  landArea: number; // in Acres
  affectedFamilies: number;
  ownershipComplexity: 'Single Owner' | 'Joint Family' | 'Community Trust' | 'Disputed Title';
  documentationStatus: 'Complete' | 'Pending Verification' | 'Missing Records' | 'Litigated';
  legalDisputesCount: number;
  compensationStatus: 'Disbursed' | 'Partially Paid' | 'Under Arbitration' | 'Unclaimed';
  rehabilitationStatus: 'Not Started' | 'In Progress' | 'Completed' | 'Stalled';
  possessionStatus: 'Not Taken' | 'Partial' | 'Complete';
  riskScore: number; // 0 to 100
  riskCategory: RiskCategory;
  delayProbability: number; // 0.00 to 1.00
  estimatedDelayDays: number;
  mainDelayFactor: string;
  mainRiskFactors: string[];
  recommendedAction: string;
  acquisitionStatus: AcquisitionStatus;
  latitude: number;
  longitude: number;
  geojson?: GeoJSONPolygonGeometry;
  updatedAt: string;
}

export interface GISFilterState {
  state: string;
  district: string;
  project: string;
  riskCategory: RiskCategory | 'ALL';
  searchQuery: string;
}

export interface StateDelayTrendItem {
  state: string;
  avgDelayDays: number;
  highRiskParcels: number;
  totalParcels: number;
}

export interface DistrictRiskDistributionItem {
  district: string;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface RiskCategoryDistributionItem {
  name: RiskCategory;
  count: number;
  percentage: number;
  color: string;
}

export interface AverageDelayDurationItem {
  projectType: string;
  avgDays: number;
  maxDays: number;
}

export interface ProjectsByStatusItem {
  status: string;
  count: number;
  percentage: number;
}

export interface TopDelayFactorItem {
  factor: string;
  count: number;
  impactScore: number;
}

export interface MonthlyDelayTrendItem {
  month: string;
  predictedDelayDays: number;
  actualDelayDays?: number;
  affectedAcres: number;
}

export interface AnalyticsSummary {
  totalParcels: number;
  highRiskCount: number;
  criticalRiskCount: number;
  avgDelayDays: number;
  totalLandAreaAcres: number;
  totalAffectedFamilies: number;
  stateDelayTrends: StateDelayTrendItem[];
  districtRiskDistributions: DistrictRiskDistributionItem[];
  riskCategoryDistributions: RiskCategoryDistributionItem[];
  avgDelayByProjectType: AverageDelayDurationItem[];
  projectsByStatus: ProjectsByStatusItem[];
  topDelayFactors: TopDelayFactorItem[];
  monthlyDelayTrends: MonthlyDelayTrendItem[];
}
