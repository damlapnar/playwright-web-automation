import { authenticatedTest as test, expect } from '../../fixtures/auth.fixture';

test.describe('Inventory Page', () => {
  test('should display all products', async ({ inventoryPage }) => {
    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);
  });

  test('should add item to cart', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.expectCartCount(1);
  });

  test('should add multiple items to cart', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.expectCartCount(2);
  });

  test('should sort products A to Z', async ({ inventoryPage, page }) => {
    await inventoryPage.sortBy('az');
    const firstItem = page.locator('.inventory_item_name').first();
    await expect(firstItem).toHaveText('Sauce Labs Backpack');
  });

  test('should sort products by price low to high', async ({ inventoryPage, page }) => {
    await inventoryPage.sortBy('lohi');
    const firstItem = page.locator('.inventory_item_price').first();
    await expect(firstItem).toHaveText('$7.99');
  });
});
