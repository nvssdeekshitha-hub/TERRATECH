export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface Alert {
  id: string;
  project_id: string;
  project_name?: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: string;
  is_read: boolean;
  triggered_at?: Date | string;
  created_at?: Date | string;
}
