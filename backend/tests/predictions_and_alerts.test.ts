import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Predictions and Alerts APIs', () => {
  let authToken = '';

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'officer.patil@terratech.gov.in',
        password: 'Password@123'
      });
    authToken = loginRes.body.data?.token || '';
  });

  describe('POST /api/predictions', () => {
    it('should generate prediction with delay_probability, risk_score, risk_category, estimated_delay_days', async () => {
      const payload = {
        project_type: 'Expressway',
        state: 'Maharashtra',
        district: 'Raigad',
        land_area_sqm: 15000,
        ownership_complexity: 'HIGH_COMPLEXITY_CO_SHARERS',
        documentation_status: 'PENDING_MUTATION',
        legal_disputes: 'CIVIL_COURT_INJUNCTION',
        compensation_status: 'ESCROW_DEPOSITED',
        approval_status: 'PENDING_CRZ',
        rehabilitation_status: 'R_R_PENDING',
        possession_status: 'PROTEST_NOT_HANDED_OVER',
        stakeholder_responsiveness: 'LOW'
      };

      const res = await request(app)
        .post('/api/predictions')
        .send(payload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('delay_probability');
      expect(res.body.data).toHaveProperty('risk_score');
      expect(res.body.data).toHaveProperty('risk_category');
      expect(res.body.data).toHaveProperty('estimated_delay_days');
    });

    it('should fail validation if required features are missing', async () => {
      const res = await request(app)
        .post('/api/predictions')
        .send({
          project_type: 'Expressway'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Alerts APIs', () => {
    let createdAlertId = '';

    it('should list alerts', async () => {
      const res = await request(app).get('/api/alerts');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should allow authorized officer to create an alert', async () => {
      const res = await request(app)
        .post('/api/alerts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          project_id: 'prj_dmic_01',
          title: 'High Risk Escalation Notice',
          message: 'Compensation dispute escalated to High Court bench.',
          severity: 'CRITICAL',
          category: 'LEGAL_DISPUTE'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      createdAlertId = res.body.data.id;
    });

    it('should mark an alert as read', async () => {
      const alertIdToMark = createdAlertId || 'alt_001';
      const res = await request(app).put(`/api/alerts/${alertIdToMark}/read`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('is_read', true);
    });
  });
});
