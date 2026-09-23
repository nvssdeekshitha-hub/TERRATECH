import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Analytics APIs', () => {
  it('GET /api/analytics/overview should return required metrics', async () => {
    const res = await request(app).get('/api/analytics/overview');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const data = res.body.data;
    expect(data).toHaveProperty('totalProjects');
    expect(data).toHaveProperty('highRiskProjects');
    expect(data).toHaveProperty('criticalProjects');
    expect(data).toHaveProperty('averageDelayProbability');
    expect(data).toHaveProperty('averageEstimatedDelay');
  });

  it('GET /api/analytics/states should return state aggregates', async () => {
    const res = await request(app).get('/api/analytics/states');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('state');
    expect(res.body.data[0]).toHaveProperty('projectCount');
  });

  it('GET /api/analytics/districts should return district breakdowns', async () => {
    const res = await request(app).get('/api/analytics/districts');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('district');
    expect(res.body.data[0]).toHaveProperty('riskCategory');
  });

  it('GET /api/analytics/delay-trends should return historical trends', async () => {
    const res = await request(app).get('/api/analytics/delay-trends');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('period');
    expect(res.body.data[0]).toHaveProperty('avgDelayDays');
  });

  it('GET /api/analytics/factors should return main delay factor breakdown', async () => {
    const res = await request(app).get('/api/analytics/factors');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toHaveProperty('factor');
    expect(res.body.data[0]).toHaveProperty('percentage');
  });
});
