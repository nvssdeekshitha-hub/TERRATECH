import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('Authentication APIs', () => {
  const testEmail = `tester_${Date.now()}@terratech.gov.in`;
  const testPassword = 'Password@123';

  it('should successfully register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: testPassword,
        full_name: 'Test Land Officer',
        role: 'OFFICER',
        department: 'Land Acquisition Wing'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toHaveProperty('email', testEmail.toLowerCase());
    expect(res.body.data.user).not.toHaveProperty('password_hash');
  });

  it('should reject registration with duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: testEmail,
        password: testPassword,
        full_name: 'Duplicate Officer'
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should successfully log in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: testPassword
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'IncorrectPassword'
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject invalid email format via validation', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'invalid-email-format',
        password: 'short',
        full_name: 'A'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
