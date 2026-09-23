import { isDbAvailable, dbQuery } from '../config/database.js';
import { Alert, AlertSeverity } from '../models/alert.model.js';
import { mockStore } from './mockData.store.js';
import { AppError } from '../middleware/errorHandler.js';

export interface AlertFilters {
  projectId?: string;
  severity?: AlertSeverity;
  isRead?: boolean;
}

export interface CreateAlertDTO {
  project_id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: string;
}

export class AlertService {
  async getAlerts(filters: AlertFilters = {}): Promise<Alert[]> {
    if (isDbAvailable()) {
      const conditions: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (filters.projectId) {
        conditions.push(`a.project_id = $${idx++}`);
        params.push(filters.projectId);
      }
      if (filters.severity) {
        conditions.push(`a.severity = $${idx++}`);
        params.push(filters.severity);
      }
      if (typeof filters.isRead === 'boolean') {
        conditions.push(`a.is_read = $${idx++}`);
        params.push(filters.isRead);
      }

      const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const sql = `
        SELECT a.*, p.name as project_name
        FROM alerts a
        LEFT JOIN projects p ON p.id = a.project_id
        ${where}
        ORDER BY a.triggered_at DESC
      `;
      const res = await dbQuery<Alert>(sql, params);
      return res.rows;
    } else {
      let list = [...mockStore.alerts];
      if (filters.projectId) {
        list = list.filter(a => a.project_id === filters.projectId);
      }
      if (filters.severity) {
        list = list.filter(a => a.severity === filters.severity);
      }
      if (typeof filters.isRead === 'boolean') {
        list = list.filter(a => a.is_read === filters.isRead);
      }
      return list.sort((a, b) => new Date(b.triggered_at || 0).getTime() - new Date(a.triggered_at || 0).getTime());
    }
  }

  async createAlert(data: CreateAlertDTO): Promise<Alert> {
    const id = `alt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();

    if (isDbAvailable()) {
      const sql = `
        INSERT INTO alerts (id, project_id, title, message, severity, category, is_read, triggered_at)
        VALUES ($1, $2, $3, $4, $5, $6, false, $7)
        RETURNING *
      `;
      const res = await dbQuery<Alert>(sql, [
        id,
        data.project_id,
        data.title,
        data.message,
        data.severity,
        data.category,
        now
      ]);
      return res.rows[0];
    } else {
      const project = mockStore.projects.find(p => p.id === data.project_id);
      const newAlert: Alert = {
        id,
        project_id: data.project_id,
        project_name: project?.name,
        title: data.title,
        message: data.message,
        severity: data.severity,
        category: data.category,
        is_read: false,
        triggered_at: now,
        created_at: now
      };
      mockStore.alerts.unshift(newAlert);
      return newAlert;
    }
  }

  async markAsRead(id: string): Promise<Alert> {
    if (isDbAvailable()) {
      const sql = `
        UPDATE alerts
        SET is_read = true
        WHERE id = $1
        RETURNING *
      `;
      const res = await dbQuery<Alert>(sql, [id]);
      if (res.rows.length === 0) {
        throw new AppError(`Alert with ID '${id}' not found`, 404);
      }
      return res.rows[0];
    } else {
      const alert = mockStore.alerts.find(a => a.id === id);
      if (!alert) {
        throw new AppError(`Alert with ID '${id}' not found`, 404);
      }
      alert.is_read = true;
      return alert;
    }
  }
}

export const alertService = new AlertService();
