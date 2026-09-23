import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('GIS APIs', () => {
  it('GET /api/gis/parcels should return standard GeoJSON FeatureCollection', async () => {
    const res = await request(app).get('/api/gis/parcels');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('type', 'FeatureCollection');
    expect(res.body).toHaveProperty('features');
    expect(Array.isArray(res.body.features)).toBe(true);
    expect(res.body.features.length).toBeGreaterThan(0);

    const firstFeature = res.body.features[0];
    expect(firstFeature).toHaveProperty('type', 'Feature');
    expect(firstFeature).toHaveProperty('geometry');
    expect(firstFeature).toHaveProperty('properties');
    expect(firstFeature.properties).toHaveProperty('riskCategory');
    expect(firstFeature.properties).toHaveProperty('riskScore');
    expect(firstFeature.properties).toHaveProperty('delayProbability');
  });

  it('GET /api/gis/parcels?projectId=prj_dmic_01 should filter GeoJSON features', async () => {
    const res = await request(app).get('/api/gis/parcels?projectId=prj_dmic_01');

    expect(res.status).toBe(200);
    expect(res.body.type).toBe('FeatureCollection');
    res.body.features.forEach((f: { properties: { projectId: string } }) => {
      expect(f.properties.projectId).toBe('prj_dmic_01');
    });
  });
});
