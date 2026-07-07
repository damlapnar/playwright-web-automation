import { test, expect } from '@playwright/test';

const BASE_API = 'https://jsonplaceholder.typicode.com';

test.describe('API Tests — Users', () => {
  test('GET /users returns 200 with user list', async ({ request }) => {
    const response = await request.get(`${BASE_API}/users`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toMatchObject({
      id: expect.any(Number),
      email: expect.stringContaining('@'),
      name: expect.any(String),
    });
  });

  test('POST /posts creates a new resource', async ({ request }) => {
    const payload = { title: 'QA Automation Test', body: 'Test content', userId: 1 };
    const response = await request.post(`${BASE_API}/posts`, { data: payload });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.title).toBe(payload.title);
    expect(body.id).toBeDefined();
  });

  test('GET /users/:id returns single user', async ({ request }) => {
    const response = await request.get(`${BASE_API}/users/2`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.id).toBe(2);
    expect(body.email).toBeDefined();
  });

  test('GET /users/:id returns 404 for non-existent user', async ({ request }) => {
    const response = await request.get(`${BASE_API}/users/9999`);
    expect(response.status()).toBe(404);
  });

  test('PUT /posts/:id updates resource', async ({ request }) => {
    const payload = { title: 'Updated Post', body: 'Updated content', userId: 1, id: 2 };
    const response = await request.put(`${BASE_API}/posts/2`, { data: payload });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.title).toBe(payload.title);
  });

  test('DELETE /posts/:id returns 200', async ({ request }) => {
    const response = await request.delete(`${BASE_API}/posts/2`);
    expect(response.status()).toBe(200);
  });
});
