import { apiTest, expect } from '@fixtures/api.fixture';
import { randomTodo } from '@utils/fakerData';

apiTest.describe('API — Todos', () => {
  apiTest('GET /todos returns a paginated list with totals', async ({ todosClient }) => {
    const res = await todosClient.list({ limit: 10 });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.todos).toHaveLength(10);
    expect(body.total).toBeGreaterThan(body.todos.length);
    expect(body.todos[0]).toMatchObject({
      id: expect.any(Number),
      todo: expect.any(String),
      completed: expect.any(Boolean),
      userId: expect.any(Number),
    });
  });

  apiTest('GET /todos skip paginates past the first page', async ({ todosClient }) => {
    const [page1, page2] = await Promise.all([
      todosClient.list({ limit: 5, skip: 0 }),
      todosClient.list({ limit: 5, skip: 5 }),
    ]);
    const [body1, body2] = await Promise.all([page1.json(), page2.json()]);
    const idsOnPage1 = body1.todos.map((t: { id: number }) => t.id);
    const idsOnPage2 = body2.todos.map((t: { id: number }) => t.id);
    expect(idsOnPage1).not.toEqual(idsOnPage2);
  });

  apiTest('GET /todos/:id returns a single todo', async ({ todosClient }) => {
    const res = await todosClient.getById(1);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(1);
  });

  apiTest('GET /todos/:id returns 404 for a non-existent todo', async ({ todosClient }) => {
    const res = await todosClient.getById(999_999);
    expect(res.status()).toBe(404);
  });

  apiTest('GET /todos/random returns a single random todo', async ({ todosClient }) => {
    const res = await todosClient.random();
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toEqual(expect.any(Number));
    expect(body.todo).toEqual(expect.any(String));
  });

  apiTest("GET /todos/user/:userId returns only that user's todos", async ({ todosClient }) => {
    const res = await todosClient.byUser(5);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.todos.length).toBeGreaterThan(0);
    for (const todo of body.todos) {
      expect(todo.userId).toBe(5);
    }
  });

  apiTest(
    'POST /todos/add creates a todo and echoes a freshly generated payload',
    async ({ todosClient }) => {
      const payload = randomTodo();
      const res = await todosClient.add(payload);
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.id).toBeDefined();
      expect(body.todo).toBe(payload.todo);
      expect(body.completed).toBe(payload.completed);
      expect(body.userId).toBe(payload.userId);
    }
  );

  apiTest('PUT /todos/:id updates the given fields', async ({ todosClient }) => {
    const res = await todosClient.update(1, { completed: true });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(1);
    expect(body.completed).toBe(true);
  });

  apiTest('DELETE /todos/:id soft-deletes the todo', async ({ todosClient }) => {
    const res = await todosClient.delete(1);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(1);
    expect(body.isDeleted).toBe(true);
    expect(body.deletedOn).toBeDefined();
  });
});
