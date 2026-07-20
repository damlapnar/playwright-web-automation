import { authenticatedTest as test, expect } from '@fixtures/auth.fixture';
import { products } from '@utils/testData';

test.describe('Inventory Page', () => {
  test('should display all products', { tag: '@smoke' }, async ({ inventoryPage }) => {
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  test('should add item to cart', { tag: '@smoke' }, async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.expectCartCount(1);
  });

  test('should add multiple items to cart', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.addItemToCart(products.bikeLight);
    await inventoryPage.expectCartCount(2);
  });

  // Exhaustive sort coverage (az/za/lohi/hilo, switching between them) lives
  // in sorting.spec.ts — kept out of here to avoid duplicating that suite.

  test('should remove item from cart', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.expectCartCount(1);
    await inventoryPage.removeItemFromCart(products.backpack);
    // The badge element doesn't render "0" — it's absent entirely at zero.
    await expect(inventoryPage.cartBadge).toBeHidden();
  });
});
