import { test, expect } from '@playwright/test';

const BASE = 'https://dummyjson.com';

test.describe('API Tests — Auth & Resources', () => {
  test('POST /auth/login returns token for valid credentials', async ({ request }) => {
    const res = await request.post(`${BASE}/auth/login`, {
      data: { username: 'emilys', password: 'emilyspass' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken.length).toBeGreaterThan(0);
  });

  test('POST /auth/login returns 400 for invalid credentials', async ({ request }) => {
    const res = await request.post(`${BASE}/auth/login`, {
      data: { username: 'invalid_user', password: 'wrongpass' },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBeDefined();
  });

  test('POST /auth/login without username returns error', async ({ request }) => {
    const res = await request.post(`${BASE}/auth/login`, {
      data: { password: 'somepass' },
    });
    expect(res.status()).toBe(400);
  });

  test('GET /users returns user list with pagination', async ({ request }) => {
    const res = await request.get(`${BASE}/users?limit=10`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.users).toBeInstanceOf(Array);
    expect(body.total).toBeGreaterThan(0);
  });

  test('GET /users second page returns different users', async ({ request }) => {
    const [p1, p2] = await Promise.all([
      request.get(`${BASE}/users?limit=5&skip=0`),
      request.get(`${BASE}/users?limit=5&skip=5`),
    ]);
    expect(p1.status()).toBe(200);
    expect(p2.status()).toBe(200);
    const b1 = await p1.json();
    const b2 = await p2.json();
    expect(b1.users[0].id).not.toBe(b2.users[0].id);
  });

  test('GET /products returns resource list', async ({ request }) => {
    const res = await request.get(`${BASE}/products`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.products).toBeInstanceOf(Array);
    expect(body.products.length).toBeGreaterThan(0);
    expect(body.products[0]).toHaveProperty('title');
  });

  test('PATCH /users/:id returns updated fields', async ({ request }) => {
    const res = await request.patch(`${BASE}/users/2`, {
      data: { firstName: 'QA Engineer' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.firstName).toBe('QA Engineer');
  });
});
