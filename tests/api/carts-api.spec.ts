import { apiTest, expect } from '@fixtures/api.fixture';

apiTest.describe('API — Carts', () => {
  apiTest('GET /carts returns a paginated list with computed totals', async ({ cartsClient }) => {
    const res = await cartsClient.list({ limit: 5 });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.carts).toHaveLength(5);
    expect(body.total).toBeGreaterThan(body.carts.length);
    for (const cart of body.carts) {
      expect(cart.totalProducts).toBe(cart.products.length);
      const expectedQuantity = cart.products.reduce(
        (sum: number, p: { quantity: number }) => sum + p.quantity,
        0
      );
      expect(cart.totalQuantity).toBe(expectedQuantity);
    }
  });

  apiTest('GET /carts/:id returns a single cart', async ({ cartsClient }) => {
    const res = await cartsClient.getById(2);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(2);
    expect(body.products.length).toBeGreaterThan(0);
  });

  apiTest('GET /carts/:id returns 404 for a non-existent cart', async ({ cartsClient }) => {
    const res = await cartsClient.getById(999_999);
    expect(res.status()).toBe(404);
  });

  apiTest("GET /carts/user/:userId returns only that user's carts", async ({ cartsClient }) => {
    const res = await cartsClient.byUser(5);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.carts.length).toBeGreaterThan(0);
    for (const cart of body.carts) {
      expect(cart.userId).toBe(5);
    }
  });

  apiTest('POST /carts/add computes per-product and cart-level totals', async ({ cartsClient }) => {
    const res = await cartsClient.add(1, [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 1 },
    ]);
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.userId).toBe(1);
    expect(body.totalProducts).toBe(2);
    expect(body.totalQuantity).toBe(3);

    const expectedTotal = body.products.reduce(
      (sum: number, p: { total: number }) => sum + p.total,
      0
    );
    expect(body.total).toBeCloseTo(expectedTotal, 2);
    // Discounted total must never exceed the pre-discount total.
    expect(body.discountedTotal).toBeLessThanOrEqual(body.total);
  });

  apiTest(
    'PUT /carts/:id with merge:true adds products to the existing cart',
    async ({ cartsClient }) => {
      const before = await (await cartsClient.getById(1)).json();
      const res = await cartsClient.update(1, [{ id: 5, quantity: 1 }]);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.products).toHaveLength(before.products.length + 1);
    }
  );

  apiTest('DELETE /carts/:id soft-deletes the cart', async ({ cartsClient }) => {
    const res = await cartsClient.delete(1);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.id).toBe(1);
    expect(body.isDeleted).toBe(true);
    expect(body.deletedOn).toBeDefined();
  });
});
