export interface MapFilter {
  riskCategories: string[];
  states: string[];
  projectTypes: string[];
  minAreaAcres?: number;
  maxAreaAcres?: number;
}

export interface ParcelGeoFeature {
  type: 'Feature';
  properties: {
    id: string;
    name: string;
    state: string;
    district: string;
    project_type: string;
    land_area_acres: number;
    risk_score: number;
    risk_category: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    estimated_delay_days: number;
    delay_probability: number;
  };
  geometry: {
    type: 'Polygon' | 'Point';
    coordinates: any;
  };
}
