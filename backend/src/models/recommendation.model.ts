export type RecommendationPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Recommendation {
  id: string;
  project_id: string;
  delay_factor: string;
  recommended_action: string;
  priority: RecommendationPriority;
  estimated_time_saving_days: number;
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'ACTION_IN_PROGRESS' | 'COMPLETED';
  created_at?: Date | string;
}
