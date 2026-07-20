import { apiTest, expect } from '@fixtures/api.fixture';

apiTest.describe('API — Products', () => {
  apiTest('GET /products returns a paginated list', async ({ productsClient }) => {
    const res = await productsClient.list({ limit: 10 });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.products).toHaveLength(10);
    expect(body.total).toBeGreaterThan(body.products.length);
    expect(body.products[0]).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      price: expect.any(Number),
    });
  });

  apiTest(
    'GET /products sortBy price orders ascending and descending',
    async ({ productsClient }) => {
      const [asc, desc] = await Promise.all([
        productsClient.list({ limit: 20, sortBy: 'price', order: 'asc' }),
        productsClient.list({ limit: 20, sortBy: 'price', order: 'desc' }),
      ]);
      const ascPrices = (await asc.json()).products.map((p: { price: number }) => p.price);
      const descPrices = (await desc.json()).products.map((p: { price: number }) => p.price);
      expect(ascPrices).toEqual([...ascPrices].sort((a, b) => a - b));
      expect(descPrices).toEqual([...descPrices].sort((a, b) => b - a));
    }
  );

  apiTest('GET /products/:id returns a single product', async ({ productsClient }) => {
    const res = await productsClient.getById(1);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(1);
    expect(body.price).toBeGreaterThan(0);
  });

  apiTest(
    'GET /products/:id returns 404 for a non-existent product',
    async ({ productsClient }) => {
      const res = await productsClient.getById(999_999);
      expect(res.status()).toBe(404);
    }
  );

  apiTest(
    'GET /products/categories returns a non-empty list of category slugs',
    async ({ productsClient }) => {
      const res = await productsClient.categories();
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
      expect(body[0]).toMatchObject({ slug: expect.any(String), name: expect.any(String) });
    }
  );

  apiTest(
    'GET /products/category/:slug returns only products in that category',
    async ({ productsClient }) => {
      const res = await productsClient.byCategory('smartphones', { limit: 10 });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.products.length).toBeGreaterThan(0);
      for (const product of body.products) {
        expect(product.category).toBe('smartphones');
      }
    }
  );

  apiTest(
    'GET /products/category/:slug for an unknown slug returns an empty list',
    async ({ productsClient }) => {
      const res = await productsClient.byCategory('not-a-real-category');
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.products).toEqual([]);
    }
  );

  apiTest('GET /products/search finds products matching the query', async ({ productsClient }) => {
    const res = await productsClient.search('phone');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.products.length).toBeGreaterThan(0);
    for (const product of body.products) {
      const haystack = `${product.title} ${product.description}`.toLowerCase();
      expect(haystack).toContain('phone');
    }
  });

  apiTest(
    'GET /products/search with no matches returns an empty list',
    async ({ productsClient }) => {
      const res = await productsClient.search('zzzznomatch');
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.products).toEqual([]);
      expect(body.total).toBe(0);
    }
  );

  apiTest(
    'POST /products/add creates a product and echoes submitted fields',
    async ({ productsClient }) => {
      const payload = { title: 'QA Widget', price: 19.99 };
      const res = await productsClient.add(payload);
      expect(res.status()).toBe(201);
      const body = await res.json();
      expect(body.id).toBeDefined();
      expect(body.title).toBe(payload.title);
      expect(body.price).toBe(payload.price);
    }
  );

  apiTest(
    'PUT /products/:id updates the given fields without clobbering the rest',
    async ({ productsClient }) => {
      const res = await productsClient.update(1, { title: 'Updated Title' });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.title).toBe('Updated Title');
      expect(body.id).toBe(1);
      // dummyjson's mock update merges rather than replaces — untouched
      // fields like price must survive the PUT.
      expect(body.price).toBeGreaterThan(0);
    }
  );

  apiTest('DELETE /products/:id soft-deletes the product', async ({ productsClient }) => {
    const res = await productsClient.delete(1);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(1);
    expect(body.isDeleted).toBe(true);
    expect(body.deletedOn).toBeDefined();
  });
});
