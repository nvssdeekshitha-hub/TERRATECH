import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Project APIs', () => {
  let authToken = '';

  beforeAll(async () => {
    // Login as admin
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@terratech.gov.in',
        password: 'Password@123'
      });
    authToken = loginRes.body.data?.token || '';
  });

  it('should list projects with pagination', async () => {
    const res = await request(app).get('/api/projects');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('pagination');
  });

  it('should filter projects by state', async () => {
    const res = await request(app).get('/api/projects?state=Maharashtra');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const projects = res.body.data;
    projects.forEach((p: { state: string }) => {
      expect(p.state.toLowerCase()).toBe('maharashtra');
    });
  });

  it('should get project details by id including parcel stats', async () => {
    const res = await request(app).get('/api/projects/prj_dmic_01');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id', 'prj_dmic_01');
    expect(res.body.data).toHaveProperty('stats');
    expect(res.body.data.stats).toHaveProperty('totalParcels');
  });

  it('should get project delay recommendations', async () => {
    const res = await request(app).get('/api/projects/prj_dmic_01/recommendations');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should allow authorized officer/admin to create project', async () => {
    const newProject = {
      name: 'Varanasi-Kolkata High-Speed Freight Hub',
      code: `VKF-${Date.now()}`,
      project_type: 'Logistics Park',
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      total_land_area_ha: 350.0,
      budget_cr: 1200.0,
      affected_families: 240,
      status: 'PLANNED',
      risk_score: 45.0,
      risk_category: 'MEDIUM',
      delay_probability: 0.45,
      estimated_delay_days: 50,
      primary_delay_factors: ['Land Conversion NOC']
    };

    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newProject);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe(newProject.name);
  });

  it('should reject project creation without authorization token', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({
        name: 'Unauthorized Project',
        code: 'UNAUTH-01'
      });

    expect(res.status).toBe(401);
  });
});
