import { isDbAvailable, dbQuery } from '../config/database.js';
import { Project, ProjectDetailResponse, ProjectSummaryStats, RiskCategory, ProjectStatus } from '../models/project.model.js';
import { mockStore } from './mockData.store.js';
import { AppError } from '../middleware/errorHandler.js';

export interface ProjectFilters {
  state?: string;
  district?: string;
  riskCategory?: RiskCategory;
  status?: ProjectStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export class ProjectService {
  async getProjects(filters: ProjectFilters = {}) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, Math.min(100, filters.limit || 20));
    const offset = (page - 1) * limit;

    if (isDbAvailable()) {
      const conditions: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (filters.state) {
        conditions.push(`state = $${idx++}`);
        params.push(filters.state);
      }
      if (filters.district) {
        conditions.push(`district = $${idx++}`);
        params.push(filters.district);
      }
      if (filters.riskCategory) {
        conditions.push(`risk_category = $${idx++}`);
        params.push(filters.riskCategory);
      }
      if (filters.status) {
        conditions.push(`status = $${idx++}`);
        params.push(filters.status);
      }
      if (filters.search) {
        conditions.push(`(name ILIKE $${idx} OR code ILIKE $${idx})`);
        params.push(`%${filters.search}%`);
        idx++;
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      const countSql = `SELECT COUNT(*) FROM projects ${whereClause}`;
      const countRes = await dbQuery<{ count: string }>(countSql, params);
      const total = parseInt(countRes.rows[0].count, 10);

      const querySql = `
        SELECT * FROM projects
        ${whereClause}
        ORDER BY risk_score DESC, created_at DESC
        LIMIT $${idx++} OFFSET $${idx++}
      `;
      const dataRes = await dbQuery<Project>(querySql, [...params, limit, offset]);

      return {
        projects: dataRes.rows,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    } else {
      // In-memory fallback
      let list = [...mockStore.projects];

      if (filters.state) {
        list = list.filter(p => p.state.toLowerCase() === filters.state?.toLowerCase());
      }
      if (filters.district) {
        list = list.filter(p => p.district.toLowerCase() === filters.district?.toLowerCase());
      }
      if (filters.riskCategory) {
        list = list.filter(p => p.risk_category === filters.riskCategory);
      }
      if (filters.status) {
        list = list.filter(p => p.status === filters.status);
      }
      if (filters.search) {
        const term = filters.search.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term));
      }

      list.sort((a, b) => b.risk_score - a.risk_score);

      const total = list.length;
      const paginated = list.slice(offset, offset + limit);

      return {
        projects: paginated,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    }
  }

  async getProjectById(id: string): Promise<ProjectDetailResponse> {
    let project: Project | null = null;
    let stats: ProjectSummaryStats;

    if (isDbAvailable()) {
      const res = await dbQuery<Project>('SELECT * FROM projects WHERE id = $1 LIMIT 1', [id]);
      if (res.rows.length === 0) {
        throw new AppError(`Project with ID '${id}' not found`, 404);
      }
      project = res.rows[0];

      // Aggregate parcel stats for this project
      const statsSql = `
        SELECT
          COUNT(*) as total_parcels,
          COUNT(*) FILTER (WHERE risk_category = 'CRITICAL') as critical_parcels,
          COUNT(*) FILTER (WHERE risk_category = 'HIGH') as high_risk_parcels,
          COUNT(*) FILTER (WHERE risk_category = 'MEDIUM') as medium_risk_parcels,
          COUNT(*) FILTER (WHERE risk_category = 'LOW') as low_risk_parcels,
          COUNT(*) FILTER (WHERE legal_disputes != 'NONE') as disputed_parcels,
          COUNT(*) FILTER (WHERE compensation_status != 'DISBURSED') as compensation_pending_parcels,
          COALESCE(SUM(area_sqm), 0) as total_area_sqm
        FROM parcels
        WHERE project_id = $1
      `;
      const statsRes = await dbQuery<{
        total_parcels: string;
        critical_parcels: string;
        high_risk_parcels: string;
        medium_risk_parcels: string;
        low_risk_parcels: string;
        disputed_parcels: string;
        compensation_pending_parcels: string;
        total_area_sqm: string;
      }>(statsSql, [id]);

      const s = statsRes.rows[0];
      stats = {
        totalParcels: parseInt(s.total_parcels || '0', 10),
        criticalParcels: parseInt(s.critical_parcels || '0', 10),
        highRiskParcels: parseInt(s.high_risk_parcels || '0', 10),
        mediumRiskParcels: parseInt(s.medium_risk_parcels || '0', 10),
        lowRiskParcels: parseInt(s.low_risk_parcels || '0', 10),
        disputedParcels: parseInt(s.disputed_parcels || '0', 10),
        compensationPendingParcels: parseInt(s.compensation_pending_parcels || '0', 10),
        totalAreaSqm: parseFloat(s.total_area_sqm || '0')
      };
    } else {
      const found = mockStore.projects.find(p => p.id === id);
      if (!found) {
        throw new AppError(`Project with ID '${id}' not found`, 404);
      }
      project = found;

      const projectParcels = mockStore.parcels.filter(p => p.project_id === id);
      stats = {
        totalParcels: projectParcels.length,
        criticalParcels: projectParcels.filter(p => p.risk_category === 'CRITICAL').length,
        highRiskParcels: projectParcels.filter(p => p.risk_category === 'HIGH').length,
        mediumRiskParcels: projectParcels.filter(p => p.risk_category === 'MEDIUM').length,
        lowRiskParcels: projectParcels.filter(p => p.risk_category === 'LOW').length,
        disputedParcels: projectParcels.filter(p => p.legal_disputes !== 'NONE').length,
        compensationPendingParcels: projectParcels.filter(p => p.compensation_status !== 'DISBURSED').length,
        totalAreaSqm: projectParcels.reduce((sum, p) => sum + p.area_sqm, 0)
      };
    }

    return {
      ...project,
      stats
    };
  }

  async createProject(data: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const id = `prj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();

    const newProject: Project = {
      ...data,
      id,
      risk_score: data.risk_score ?? 0,
      risk_category: data.risk_category ?? 'LOW',
      delay_probability: data.delay_probability ?? 0,
      estimated_delay_days: data.estimated_delay_days ?? 0,
      primary_delay_factors: data.primary_delay_factors || [],
      created_at: now,
      updated_at: now
    };

    if (isDbAvailable()) {
      const sql = `
        INSERT INTO projects (
          id, name, code, project_type, state, district,
          total_land_area_ha, budget_cr, affected_families, status,
          risk_score, risk_category, delay_probability, estimated_delay_days,
          primary_delay_factors
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING *
      `;
      const res = await dbQuery<Project>(sql, [
        newProject.id,
        newProject.name,
        newProject.code,
        newProject.project_type,
        newProject.state,
        newProject.district,
        newProject.total_land_area_ha,
        newProject.budget_cr,
        newProject.affected_families,
        newProject.status,
        newProject.risk_score,
        newProject.risk_category,
        newProject.delay_probability,
        newProject.estimated_delay_days,
        JSON.stringify(newProject.primary_delay_factors)
      ]);
      return res.rows[0];
    } else {
      mockStore.projects.push(newProject);
      return newProject;
    }
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    if (isDbAvailable()) {
      const existing = await this.getProjectById(id);
      const updated: Project = {
        ...existing,
        ...data,
        updated_at: new Date()
      };

      const sql = `
        UPDATE projects
        SET
          name = COALESCE($2, name),
          project_type = COALESCE($3, project_type),
          state = COALESCE($4, state),
          district = COALESCE($5, district),
          total_land_area_ha = COALESCE($6, total_land_area_ha),
          budget_cr = COALESCE($7, budget_cr),
          affected_families = COALESCE($8, affected_families),
          status = COALESCE($9, status),
          risk_score = COALESCE($10, risk_score),
          risk_category = COALESCE($11, risk_category),
          delay_probability = COALESCE($12, delay_probability),
          estimated_delay_days = COALESCE($13, estimated_delay_days),
          primary_delay_factors = COALESCE($14, primary_delay_factors),
          updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;

      const res = await dbQuery<Project>(sql, [
        id,
        data.name,
        data.project_type,
        data.state,
        data.district,
        data.total_land_area_ha,
        data.budget_cr,
        data.affected_families,
        data.status,
        data.risk_score,
        data.risk_category,
        data.delay_probability,
        data.estimated_delay_days,
        data.primary_delay_factors ? JSON.stringify(data.primary_delay_factors) : null
      ]);

      return res.rows[0];
    } else {
      const index = mockStore.projects.findIndex(p => p.id === id);
      if (index === -1) {
        throw new AppError(`Project with ID '${id}' not found`, 404);
      }
      mockStore.projects[index] = {
        ...mockStore.projects[index],
        ...data,
        updated_at: new Date()
      };
      return mockStore.projects[index];
    }
  }
}

export const projectService = new ProjectService();
