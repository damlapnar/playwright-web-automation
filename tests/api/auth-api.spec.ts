import { test, expect } from '@playwright/test';

const BASE = 'https://reqres.in/api';

test.describe('API Tests — Auth & Resources', () => {
  test('POST /login returns token for valid credentials', async ({ request }) => {
    const res = await request.post(`${BASE}/login`, {
      data: { email: 'eve.holt@reqres.in', password: 'cityslicka' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('POST /login returns 400 for missing password', async ({ request }) => {
    const res = await request.post(`${BASE}/login`, {
      data: { email: 'eve.holt@reqres.in' },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBe('Missing password');
  });

  test('POST /register returns id and token', async ({ request }) => {
    const res = await request.post(`${BASE}/register`, {
      data: { email: 'eve.holt@reqres.in', password: 'pistol' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBeDefined();
    expect(body.token).toBeDefined();
  });

  test('POST /register returns 400 without password', async ({ request }) => {
    const res = await request.post(`${BASE}/register`, {
      data: { email: 'sydney@fife' },
    });
    expect(res.status()).toBe(400);
    expect((await res.json()).error).toBeDefined();
  });

  test('GET /users supports pagination', async ({ request }) => {
    const [p1, p2] = await Promise.all([
      request.get(`${BASE}/users?page=1`),
      request.get(`${BASE}/users?page=2`),
    ]);
    expect(p1.status()).toBe(200);
    expect(p2.status()).toBe(200);
    const b1 = await p1.json();
    const b2 = await p2.json();
    expect(b1.page).toBe(1);
    expect(b2.page).toBe(2);
    expect(b1.data[0].id).not.toBe(b2.data[0].id);
  });

  test('GET /unknown returns resource list', async ({ request }) => {
    const res = await request.get(`${BASE}/unknown`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toHaveProperty('name');
  });

  test('PATCH /users/:id returns updated fields', async ({ request }) => {
    const res = await request.patch(`${BASE}/users/2`, {
      data: { job: 'Senior QA Engineer' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.job).toBe('Senior QA Engineer');
    expect(body.updatedAt).toBeDefined();
  });
});
