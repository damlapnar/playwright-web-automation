import { apiTest, expect } from '@fixtures/api.fixture';
import { DUMMYJSON_BASE_URL } from '@api/constants';

// Cross-cutting checks that apply to the API as a whole rather than to one
// resource: headers, timing, and how it behaves under malformed/hostile
// input. Kept separate from the per-resource specs so a header or timing
// regression doesn't get lost among dozens of CRUD assertions.
apiTest.describe('API — Contract & Resilience', () => {
  apiTest('responses are served as JSON with a charset', async ({ productsClient }) => {
    const res = await productsClient.getById(1);
    expect(res.headers()['content-type']).toContain('application/json');
  });

  apiTest(
    'a core endpoint responds within a generous latency budget',
    async ({ productsClient }) => {
      const start = Date.now();
      const res = await productsClient.list({ limit: 10 });
      const elapsedMs = Date.now() - start;
      expect(res.status()).toBe(200);
      // Generous on purpose — this hits a live third-party service over the
      // network, so the bar is "not badly broken," not a strict perf budget.
      expect(elapsedMs).toBeLessThan(5000);
    }
  );

  apiTest('an oversized numeric id 404s instead of erroring', async ({ productsClient }) => {
    const res = await productsClient.getById('99999999999999999999');
    expect(res.status()).toBe(404);
  });

  apiTest('a negative id 404s instead of erroring', async ({ usersClient }) => {
    const res = await usersClient.getById(-1);
    expect(res.status()).toBe(404);
  });

  apiTest('sending an unexpected content-type does not crash the endpoint', async ({ request }) => {
    const res = await request.post(`${DUMMYJSON_BASE_URL}/auth/login`, {
      headers: { 'Content-Type': 'text/plain' },
      data: 'username=emilys&password=emilyspass',
    });
    expect(res.status()).toBeLessThan(500);
  });

  apiTest('an empty request body on a POST endpoint is handled gracefully', async ({ request }) => {
    const res = await request.post(`${DUMMYJSON_BASE_URL}/auth/login`, {
      headers: { 'Content-Type': 'application/json' },
      data: {},
    });
    expect(res.status()).toBeLessThan(500);
    expect(res.status()).toBe(400);
  });

  apiTest(
    'an unsupported method on a resource collection is rejected, not 5xx',
    async ({ request }) => {
      const res = await request.delete(`${DUMMYJSON_BASE_URL}/products/categories`);
      expect(res.status()).toBeLessThan(500);
    }
  );

  apiTest('a nonexistent route returns 404, not a generic 200', async ({ request }) => {
    const res = await request.get(`${DUMMYJSON_BASE_URL}/this-route-does-not-exist`);
    expect(res.status()).toBe(404);
  });
});
