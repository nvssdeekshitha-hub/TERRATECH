import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Parcel APIs', () => {
  it('should list parcels with default pagination', async () => {
    const res = await request(app).get('/api/parcels');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty('pagination');
  });

  it('should filter parcels by riskCategory', async () => {
    const res = await request(app).get('/api/parcels?riskCategory=CRITICAL');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const parcels = res.body.data;
    parcels.forEach((p: { risk_category: string }) => {
      expect(p.risk_category).toBe('CRITICAL');
    });
  });

  it('should get single parcel details by id', async () => {
    const res = await request(app).get('/api/parcels/pcl_raigad_001');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id', 'pcl_raigad_001');
    expect(res.body.data).toHaveProperty('coordinates_geojson');
  });

  it('should return 404 for non-existent parcel', async () => {
    const res = await request(app).get('/api/parcels/non_existent_parcel_id');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
