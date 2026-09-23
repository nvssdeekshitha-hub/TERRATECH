import { isDbAvailable, dbQuery } from '../config/database.js';
import { Recommendation } from '../models/recommendation.model.js';
import { mockStore } from './mockData.store.js';
import { projectService } from './project.service.js';

export class RecommendationService {
  async getProjectRecommendations(projectId: string): Promise<Recommendation[]> {
    if (isDbAvailable()) {
      const sql = 'SELECT * FROM recommendations WHERE project_id = $1 ORDER BY priority ASC, created_at DESC';
      const res = await dbQuery<Recommendation>(sql, [projectId]);
      if (res.rows.length > 0) {
        return res.rows;
      }
    } else {
      const existing = mockStore.recommendations.filter(r => r.project_id === projectId);
      if (existing.length > 0) {
        return existing;
      }
    }

    // Dynamic generator based on project profile
    const project = await projectService.getProjectById(projectId);
    const generated: Recommendation[] = [];

    if (project.primary_delay_factors && project.primary_delay_factors.length > 0) {
      project.primary_delay_factors.forEach((factor, index) => {
        generated.push({
          id: `rec_gen_${projectId}_${index}`,
          project_id: projectId,
          delay_factor: factor,
          recommended_action: this.deriveActionForFactor(factor),
          priority: index === 0 ? 'HIGH' : 'MEDIUM',
          estimated_time_saving_days: index === 0 ? 60 : 30,
          status: 'PENDING',
          created_at: new Date()
        });
      });
    } else {
      generated.push({
        id: `rec_gen_${projectId}_default`,
        project_id: projectId,
        delay_factor: 'General Pre-acquisition Verification',
        recommended_action: 'Conduct integrated digital land audit using GIS survey maps and digitized revenue cadastre to preempt title disputes.',
        priority: 'MEDIUM',
        estimated_time_saving_days: 45,
        status: 'PENDING',
        created_at: new Date()
      });
    }

    return generated;
  }

  private deriveActionForFactor(factor: string): string {
    const f = factor.toLowerCase();
    if (f.includes('legal') || f.includes('court') || f.includes('stay')) {
      return 'Convene special bench with District Judge & LARRA Authority for fast-track dispute conciliation under Section 64/76.';
    }
    if (f.includes('compensation') || f.includes('rate') || f.includes('formula')) {
      return 'Formulate direct negotiated purchase package with 20-25% ex-gratia incentive for prompt possession hand-over.';
    }
    if (f.includes('rehabilitation') || f.includes('r&r') || f.includes('colony')) {
      return 'Fast-track civic infrastructure handover in resettlement township and release interim transit sustenance allowances.';
    }
    if (f.includes('family') || f.includes('co-sharer') || f.includes('title')) {
      return 'Deploy mobile revenue camps with local Tehsildar to verify genealogy and split award compensation into individual bank accounts.';
    }
    if (f.includes('clearance') || f.includes('environmental') || f.includes('crz')) {
      return 'Engage dedicated liaison officer for single-window compliance tracking with State Appraisal Committee.';
    }
    return 'Implement proactive stakeholder engagement protocol and monthly inter-departmental nodal review.';
  }
}

export const recommendationService = new RecommendationService();
