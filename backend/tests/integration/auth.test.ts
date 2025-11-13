import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/index';
import { User } from '../../src/models/User';

describe('Auth Integration Tests', () => {
  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    const validUser = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe(validUser.email.toLowerCase());
      expect(response.body.data.user.name).toBe(validUser.name);
      expect(response.body.data.user).not.toHaveProperty('password_hash');
    });

    it('should register user with workshop profile', async () => {
      const userWithProfile = {
        ...validUser,
        workshop_profile: {
          saw: true,
          router: true,
          table_saw: true,
        },
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userWithProfile)
        .expect(201);

      expect(response.body.data.user.workshop_profile.saw).toBe(true);
      expect(response.body.data.user.workshop_profile.router).toBe(true);
      expect(response.body.data.user.workshop_profile.table_saw).toBe(true);
    });

    it('should fail with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ password: 'password123', name: 'Test User' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', name: 'Test User' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with missing name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, email: 'invalid-email' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, password: '12345' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with duplicate email', async () => {
      // Register first user
      await request(app).post('/api/auth/register').send(validUser).expect(201);

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should normalize email to lowercase', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, email: 'TEST@EXAMPLE.COM' })
        .expect(201);

      expect(response.body.data.user.email).toBe('test@example.com');
    });
  });

  describe('POST /api/auth/login', () => {
    const userCredentials = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    beforeEach(async () => {
      // Register a user before each login test
      await request(app).post('/api/auth/register').send(userCredentials);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userCredentials.email,
          password: userCredentials.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe(userCredentials.email);
    });

    it('should login with case-insensitive email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'TEST@EXAMPLE.COM',
          password: userCredentials.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userCredentials.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: userCredentials.password,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should fail with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: userCredentials.password })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: userCredentials.email })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Register and login to get a refresh token
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      refreshToken = response.body.data.refreshToken;
    });

    it('should refresh access token successfully', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Token refreshed successfully');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should fail with missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let accessToken: string;
    let userId: string;

    beforeEach(async () => {
      // Register a user and get access token
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      accessToken = response.body.data.accessToken;
      userId = response.body.data.user.id;
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe(userId);
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user.name).toBe('Test User');
    });

    it('should fail without authorization header', async () => {
      const response = await request(app).get('/api/auth/me').expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('authorization');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/auth/profile', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Register a user and get access token
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        });

      accessToken = response.body.data.accessToken;
    });

    it('should update user name', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe('Updated Name');
    });

    it('should update workshop profile', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          workshop_profile: {
            saw: true,
            router: true,
            table_saw: true,
          },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.workshop_profile.saw).toBe(true);
      expect(response.body.data.user.workshop_profile.router).toBe(true);
    });

    it('should update both name and workshop profile', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'New Name',
          workshop_profile: {
            saw: true,
            planer: true,
          },
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe('New Name');
      expect(response.body.data.user.workshop_profile.saw).toBe(true);
    });

    it('should fail without authorization', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .send({ name: 'Updated Name' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid name length', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'A' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
