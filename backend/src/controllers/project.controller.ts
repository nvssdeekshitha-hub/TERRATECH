import { Request, Response, NextFunction } from 'express';
import { projectService, ProjectFilters } from '../services/project.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class ProjectController {
  async getProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: ProjectFilters = {
        state: req.query.state as string,
        district: req.query.district as string,
        riskCategory: req.query.riskCategory as any,
        status: req.query.status as any,
        search: req.query.search as string,
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20
      };

      const result = await projectService.getProjects(filters);
      sendSuccess(res, result.projects, 'Projects retrieved successfully', 200, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      });
    } catch (err) {
      next(err);
    }
  }

  async getProjectById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(id);
      sendSuccess(res, project, 'Project details retrieved successfully', 200);
    } catch (err) {
      next(err);
    }
  }

  async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await projectService.createProject(req.body);
      sendSuccess(res, created, 'Project created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await projectService.updateProject(id, req.body);
      sendSuccess(res, updated, 'Project updated successfully', 200);
    } catch (err) {
      next(err);
    }
  }
}

export const projectController = new ProjectController();
