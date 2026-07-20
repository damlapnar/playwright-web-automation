import { apiTest, expect } from '@fixtures/api.fixture';

apiTest.describe('API — Users', () => {
  apiTest('GET /users returns a paginated list with totals', async ({ usersClient }) => {
    const res = await usersClient.list({ limit: 10 });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.users).toBeInstanceOf(Array);
    expect(body.users).toHaveLength(10);
    expect(body.total).toBeGreaterThan(body.users.length);
    expect(body.limit).toBe(10);
    expect(body.skip).toBe(0);
  });

  apiTest('GET /users skip paginates past the first page', async ({ usersClient }) => {
    const [page1, page2] = await Promise.all([
      usersClient.list({ limit: 5, skip: 0 }),
      usersClient.list({ limit: 5, skip: 5 }),
    ]);
    const [body1, body2] = await Promise.all([page1.json(), page2.json()]);
    const idsOnPage1 = body1.users.map((u: { id: number }) => u.id);
    const idsOnPage2 = body2.users.map((u: { id: number }) => u.id);
    expect(idsOnPage1).not.toEqual(idsOnPage2);
  });

  apiTest('GET /users select limits the returned fields', async ({ usersClient }) => {
    const res = await usersClient.list({ limit: 1, select: 'firstName,age' });
    const body = await res.json();
    const [user] = body.users;
    expect(Object.keys(user).sort()).toEqual(['age', 'firstName', 'id']);
  });

  apiTest('GET /users sortBy orders results ascending and descending', async ({ usersClient }) => {
    const [asc, desc] = await Promise.all([
      usersClient.list({ limit: 20, sortBy: 'age', order: 'asc' }),
      usersClient.list({ limit: 20, sortBy: 'age', order: 'desc' }),
    ]);
    const ascAges = (await asc.json()).users.map((u: { age: number }) => u.age);
    const descAges = (await desc.json()).users.map((u: { age: number }) => u.age);
    expect(ascAges).toEqual([...ascAges].sort((a, b) => a - b));
    expect(descAges).toEqual([...descAges].sort((a, b) => b - a));
  });

  apiTest('GET /users/:id returns a single user', async ({ usersClient }) => {
    const res = await usersClient.getById(2);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(2);
    expect(body.email).toContain('@');
  });

  apiTest('GET /users/:id returns 404 for a non-existent user', async ({ usersClient }) => {
    const res = await usersClient.getById(999_999);
    expect(res.status()).toBe(404);
    const body = await res.json();
    expect(body.message).toContain('999999');
  });

  apiTest(
    'GET /users/:id rejects a non-numeric id without a server error',
    async ({ usersClient }) => {
      const res = await usersClient.getById('not-an-id');
      // Contract check: whatever the status, the API must not fall over —
      // a 5xx here would mean unvalidated input reached something unguarded.
      expect(res.status()).toBeLessThan(500);
    }
  );

  apiTest('GET /users/search finds users matching the query', async ({ usersClient }) => {
    const res = await usersClient.search('Emily');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.users.length).toBeGreaterThan(0);
    for (const user of body.users) {
      const haystack = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase();
      expect(haystack).toContain('emily');
    }
  });

  apiTest(
    'GET /users/search with no matches returns an empty list, not an error',
    async ({ usersClient }) => {
      const res = await usersClient.search('zzzzzznomatch');
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.users).toEqual([]);
      expect(body.total).toBe(0);
    }
  );

  apiTest(
    'GET /users/search does not choke on script-injection-shaped input',
    async ({ usersClient }) => {
      const res = await usersClient.search('<script>alert(1)</script>');
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.users).toEqual([]);
    }
  );

  apiTest(
    'GET /users/filter returns only users matching the field value',
    async ({ usersClient }) => {
      const res = await usersClient.filter('hair.color', 'Brown');
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.users.length).toBeGreaterThan(0);
      for (const user of body.users) {
        expect(user.hair.color).toBe('Brown');
      }
    }
  );

  apiTest('POST /users/add creates a user and echoes submitted fields', async ({ usersClient }) => {
    const payload = { firstName: 'QA', lastName: 'Automation', age: 30 };
    const res = await usersClient.add(payload);
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.id).toBeDefined();
    expect(body.firstName).toBe(payload.firstName);
    expect(body.lastName).toBe(payload.lastName);
  });

  apiTest('PUT /users/:id updates the given fields', async ({ usersClient }) => {
    const res = await usersClient.update(1, { firstName: 'Updated' });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.firstName).toBe('Updated');
    expect(body.id).toBe(1);
  });

  apiTest('PATCH /users/:id partially updates a user', async ({ usersClient }) => {
    const res = await usersClient.patch(2, { age: 99 });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.age).toBe(99);
  });

  apiTest('DELETE /users/:id soft-deletes the user', async ({ usersClient }) => {
    const res = await usersClient.delete(3);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(3);
    expect(body.isDeleted).toBe(true);
    expect(body.deletedOn).toBeDefined();
  });
});
