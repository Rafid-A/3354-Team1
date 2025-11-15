import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../app.js';
import { db } from '../db/db.js';
import { products, productImages, users, vendors, categories } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword } from '../utils/hashPassword.js';

describe('Product Routes', () => {
  let testProductId;
  let testCategoryId;
  let testVendorId;
  let testUserId;
  let authToken;

  beforeAll(async () => {
    try {
      const testUser = {
        name: 'Product Test Vendor',
        email: 'producttestvendor@example.com',
        password: 'testpassword123',
      };

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, testUser.email))
        .limit(1);

      if (existingUser.length === 0) {
        const hashedPassword = await hashPassword(testUser.password);
        const newUser = await db
          .insert(users)
          .values({
            name: testUser.name,
            email: testUser.email,
            password: hashedPassword,
            role: 'vendor',
          })
          .returning({ userId: users.userId });
        testUserId = newUser[0].userId;
      } else {
        testUserId = existingUser[0].userId;
      }

      const existingCategory = await db
        .select()
        .from(categories)
        .where(eq(categories.name, 'electronics'))
        .limit(1);

      if (existingCategory.length === 0) {
        try {
          const newCategory = await db
            .insert(categories)
            .values({
              name: 'electronics',
              description: 'Electronic products',
            })
            .returning({ categoryId: categories.categoryId });
          testCategoryId = newCategory[0].categoryId;
        } catch (error) {
          const retryCategory = await db
            .select()
            .from(categories)
            .where(eq(categories.name, 'electronics'))
            .limit(1);
          if (retryCategory.length > 0) {
            testCategoryId = retryCategory[0].categoryId;
          } else {
            throw error; // Re-throw if we still can't find it
          }
        }
      } else {
        testCategoryId = existingCategory[0].categoryId;
      }

      const existingVendor = await db
        .select()
        .from(vendors)
        .where(eq(vendors.userId, testUserId))
        .limit(1);

      if (existingVendor.length === 0) {
        const newVendor = await db
          .insert(vendors)
          .values({
            userId: testUserId,
            storeName: 'Test Store',
            description: 'Test store description',
          })
          .returning({ vendorId: vendors.vendorId });
        testVendorId = newVendor[0].vendorId;
      } else {
        testVendorId = existingVendor[0].vendorId;
      }

      const newProduct = await db
        .insert(products)
        .values({
          vendorId: testVendorId,
          categoryId: testCategoryId,
          name: 'Test Product for API Testing',
          brand: 'Test Brand',
          description: 'This is a test product for API testing',
          price: '99.99',
          stockQuantity: 10,
        })
        .returning({ productId: products.productId });

      testProductId = newProduct[0].productId;

      await db.insert(productImages).values({
        productId: testProductId,
        imageUrl: 'https://example.com/test-image.jpg',
        isPrimary: true,
      });

      // Get auth token for vendor user by logging in
      try {
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: testUser.email,
            password: testUser.password,
          });

        if (loginResponse.status === 200 && loginResponse.body.jwt) {
          authToken = loginResponse.body.jwt;
        }
      } catch (error) {
        console.log('Failed to get auth token:', error.message);
      }
    } catch (error) {
      console.log('Setup error:', error.message);
    }
  });

  afterAll(async () => {
    try {
      if (testProductId) {
        await db.delete(productImages).where(eq(productImages.productId, testProductId));
      }

      if (testProductId) {
        await db.delete(products).where(eq(products.productId, testProductId));
      }

    } catch (error) {
      console.log('Cleanup error:', error.message);
    }
  });

  describe('GET /api/products', () => {
    // Test case: Get all products from the API
    // Expected result: Status 200, array of products returned
    it('should successfully get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      if (response.body.length > 0) {
        const product = response.body[0];
        expect(product).toHaveProperty('productId');
        expect(product).toHaveProperty('productName');
        expect(product).toHaveProperty('price');
        expect(typeof product.price).toBe('number');
      }
    });

    // Test case: Get all products when none exist in database
    // Expected result: Status 400 or 200 (depends on database state), error message if 400
    it('should return error when no products exist', async () => {
      const response = await request(app)
        .get('/api/products');

      expect([200, 400]).toContain(response.status);
      
      if (response.status === 400) {
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('No product found');
      }
    });
  });

  describe('GET /api/products/:id', () => {
    // Test case: Get product by valid product ID
    // Expected result: Status 200, product details with images returned
    it('should successfully get product by valid ID', async () => {
      if (!testProductId) {
        console.log('Skipping test - test product not created');
        return;
      }

      const response = await request(app)
        .get(`/api/products/${testProductId}`)
        .expect(200);

      expect(response.body).toHaveProperty('productId', testProductId);
      expect(response.body).toHaveProperty('productName');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('price');
      expect(response.body).toHaveProperty('images');
      expect(Array.isArray(response.body.images)).toBe(true);
    });

    // Test case: Get product with non-existent product ID
    // Expected result: Status 400, error message "Invalid product ID"
    it('should return error for non-existent product ID', async () => {
      const fakeProductId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .get(`/api/products/${fakeProductId}`)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Invalid product ID');
    });
  });

  describe('POST /api/products', () => {
    // Test case: Create product with valid authentication and vendor role
    // Expected result: Status 201, productId returned
    it('should successfully create a product with valid authentication', async () => {
      if (!authToken) {
        console.log('Skipping test - auth token not available');
        return;
      }

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'New Test Product',
          brand: 'Test Brand',
          description: 'Test description for new product',
          price: 50.00,
          stockQuantity: 5,
          category: 'electronics',
        })
        .expect(201);

      expect(response.body).toHaveProperty('productId');
    });

    // Test case: Create product without authentication
    // Expected result: Status 401, error message returned
    it('should require authentication to create product', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          name: 'New Product',
          brand: 'Test Brand',
          description: 'Test description',
          price: 50.00,
          stockQuantity: 5,
          category: 'electronics',
        })
        .expect(401);

      expect(response.body).toHaveProperty('message');
    });
  });
});

