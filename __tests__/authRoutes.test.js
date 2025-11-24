import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { db } from '../db/db.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

describe('Auth Routes', () => {
  // Test user data
  const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
  };

  const anotherTestUser = {
    name: 'Another User',
    email: 'anotheruser@example.com',
    password: 'password123',
  };

  beforeAll(async () => {
    // Clean up any existing test users before starting tests
    try {
      await db.delete(users).where(eq(users.email, testUser.email));
      await db.delete(users).where(eq(users.email, anotherTestUser.email));
    } catch (error) {
      console.log('Cleanup before tests:', error.message);
    }
  });

  afterAll(async () => {
    // Clean up test users after all tests complete
    try {
      await db.delete(users).where(eq(users.email, testUser.email));
      await db.delete(users).where(eq(users.email, anotherTestUser.email));
    } catch (error) {
      console.log('Cleanup after tests:', error.message);
    }
  });

  describe('POST /api/auth/signup', () => {
    // Test case: Successful user signup with valid information
    // Expected result: Status 201, user data and JWT token returned
    it('should successfully create a new user account', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('name', testUser.name);
      expect(response.body).toHaveProperty('jwt');
      expect(typeof response.body.jwt).toBe('string');
    });

    // Test case: Signup with duplicate email
    // Expected result: Status 400, error message "User already exists"
    it('should reject signup with duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(testUser)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    // Test case: Login with correct credentials
    // Expected result: Status 200, user data and JWT token returned
    it('should successfully login with correct credentials', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send(anotherTestUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: anotherTestUser.email,
          password: anotherTestUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('name', anotherTestUser.name);
      expect(response.body).toHaveProperty('jwt');
      expect(typeof response.body.jwt).toBe('string');
    });

    // Test case: Login with non-existent email
    // Expected result: Status 400, error message "Invalid Credentials"
    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid Credentials');
    });
  });

  describe('GET /api/auth/profile', () => {
    let authToken;

    beforeAll(async () => {
      try {
        await db.delete(users).where(eq(users.email, 'profiletest@example.com'));
      } catch (error) {
        // Ignore errors
      }

      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Profile Test User',
          email: 'profiletest@example.com',
          password: 'password123',
        })
        .expect(201);

      authToken = signupResponse.body.jwt;
    });

    afterAll(async () => {
      try {
        await db.delete(users).where(eq(users.email, 'profiletest@example.com'));
      } catch (error) {
        console.log('Cleanup profile test user:', error.message);
      }
    });

    // Test case: Get user profile with valid authentication token
    // Expected result: Status 200, user profile data returned
    it('should successfully get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('email');
      expect(response.body).toHaveProperty('role');
    });

    // Test case: Get profile without authentication token
    // Expected result: Status 401, error message "Unauthorized Request"
    it('should reject profile request without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Unauthorized Request');
    });
  });
});

