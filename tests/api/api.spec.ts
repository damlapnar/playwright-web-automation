import { test, expect } from '@playwright/test';

const BASE_API = 'https://reqres.in/api';

test.describe('API Tests — Users', () => {
  test('GET /users returns 200 with user list', async ({ request }) => {
    const response = await request.get(`${BASE_API}/users?page=1`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0]).toMatchObject({
      id: expect.any(Number),
      email: expect.stringContaining('@'),
      first_name: expect.any(String),
    });
  });

  test('POST /users creates a new user', async ({ request }) => {
    const payload = { name: 'Damla', job: 'QA Engineer' };

    const response = await request.post(`${BASE_API}/users`, { data: payload });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body.id).toBeDefined();
  });

  test('GET /users/:id returns single user', async ({ request }) => {
    const response = await request.get(`${BASE_API}/users/2`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data.id).toBe(2);
  });

  test('GET /users/:id returns 404 for non-existent user', async ({ request }) => {
    const response = await request.get(`${BASE_API}/users/9999`);
    expect(response.status()).toBe(404);
  });

  test('PUT /users/:id updates user', async ({ request }) => {
    const payload = { name: 'Damla Updated', job: 'Senior QA Engineer' };

    const response = await request.put(`${BASE_API}/users/2`, { data: payload });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.name).toBe(payload.name);
    expect(body.updatedAt).toBeDefined();
  });

  test('DELETE /users/:id returns 204', async ({ request }) => {
    const response = await request.delete(`${BASE_API}/users/2`);
    expect(response.status()).toBe(204);
  });
});
