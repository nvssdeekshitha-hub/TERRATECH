import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  full_name: z.string().min(2, 'Full name must be at least 2 characters long'),
  role: z.enum(['ADMIN', 'OFFICER', 'POLICYMAKER', 'VIEWER']).optional(),
  department: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required')
});

export const createProjectSchema = z.object({
  name: z.string().min(3, 'Project name is required and must have at least 3 characters'),
  code: z.string().min(2, 'Project code is required'),
  project_type: z.string().min(2, 'Project type is required'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  total_land_area_ha: z.number().nonnegative('Total land area must be >= 0'),
  budget_cr: z.number().nonnegative('Budget must be >= 0'),
  affected_families: z.number().int().nonnegative('Affected families count must be an integer >= 0'),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'DELAYED', 'COMPLETED', 'HALTED']).optional().default('IN_PROGRESS'),
  risk_score: z.number().min(0).max(100).optional().default(0),
  risk_category: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional().default('LOW'),
  delay_probability: z.number().min(0).max(1).optional().default(0),
  estimated_delay_days: z.number().int().nonnegative().optional().default(0),
  primary_delay_factors: z.array(z.string()).optional()
});

export const updateProjectSchema = createProjectSchema.partial();

export const predictionInputSchema = z.object({
  project_id: z.string().optional(),
  parcel_id: z.string().optional(),
  project_type: z.string().min(1, 'project_type is required'),
  state: z.string().min(1, 'state is required'),
  district: z.string().min(1, 'district is required'),
  land_area_sqm: z.number().positive('land_area_sqm must be positive'),
  affected_families: z.number().int().nonnegative().optional(),
  ownership_complexity: z.string().min(1, 'ownership_complexity is required'),
  documentation_status: z.string().min(1, 'documentation_status is required'),
  legal_disputes: z.string().min(1, 'legal_disputes is required'),
  compensation_status: z.string().min(1, 'compensation_status is required'),
  approval_status: z.string().min(1, 'approval_status is required'),
  rehabilitation_status: z.string().min(1, 'rehabilitation_status is required'),
  possession_status: z.string().min(1, 'possession_status is required'),
  stakeholder_responsiveness: z.string().min(1, 'stakeholder_responsiveness is required'),
  administrative_processing_days: z.number().nonnegative().optional(),
  historical_district_delay_rate: z.number().min(0).max(1).optional()
});

export const createAlertSchema = z.object({
  project_id: z.string().min(1, 'project_id is required'),
  title: z.string().min(3, 'Alert title is required'),
  message: z.string().min(5, 'Alert message is required'),
  severity: z.enum(['INFO', 'WARNING', 'CRITICAL']),
  category: z.string().min(2, 'category is required')
});
