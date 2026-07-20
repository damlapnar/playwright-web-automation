import { apiTest, expect } from '@fixtures/api.fixture';

apiTest.describe('API — Posts', () => {
  apiTest('GET /posts returns 200 with a post list', async ({ postsClient }) => {
    const res = await postsClient.list();
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toMatchObject({
      id: expect.any(Number),
      userId: expect.any(Number),
      title: expect.any(String),
    });
  });

  apiTest("GET /posts?userId filters to that user's posts", async ({ postsClient }) => {
    const res = await postsClient.list({ userId: 1 });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.length).toBeGreaterThan(0);
    for (const post of body) {
      expect(post.userId).toBe(1);
    }
  });

  apiTest('GET /posts/:id returns a single post', async ({ postsClient }) => {
    const res = await postsClient.getById(2);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(2);
  });

  apiTest('GET /posts/:id returns 404 for a non-existent post', async ({ postsClient }) => {
    const res = await postsClient.getById(9999);
    expect(res.status()).toBe(404);
  });

  apiTest('GET /posts/:id/comments returns the comments for that post', async ({ postsClient }) => {
    const res = await postsClient.comments(1);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.length).toBeGreaterThan(0);
    for (const comment of body) {
      expect(comment.postId).toBe(1);
      expect(comment.email).toContain('@');
    }
  });

  apiTest('POST /posts creates a new resource', async ({ postsClient }) => {
    const payload = { title: 'QA Automation Test', body: 'Test content', userId: 1 };
    const res = await postsClient.create(payload);
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.title).toBe(payload.title);
    expect(body.id).toBeDefined();
  });

  apiTest('PUT /posts/:id replaces the resource', async ({ postsClient }) => {
    const payload = { id: 2, title: 'Updated Post', body: 'Updated content', userId: 1 };
    const res = await postsClient.update(2, payload);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.title).toBe(payload.title);
  });

  apiTest('PATCH /posts/:id updates only the given fields', async ({ postsClient }) => {
    const res = await postsClient.patch(1, { title: 'Patched Title' });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('Patched Title');
    // Untouched fields must survive a PATCH, unlike a PUT replace.
    expect(body.body).toBeDefined();
  });

  apiTest('DELETE /posts/:id returns 200', async ({ postsClient }) => {
    const res = await postsClient.delete(2);
    expect(res.status()).toBe(200);
  });
});
