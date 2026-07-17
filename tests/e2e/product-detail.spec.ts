import { authenticatedTest as test, expect } from '../../fixtures/auth.fixture';
import { ProductPage } from '../../pages/ProductPage';

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ page, inventoryPage: _ }) => {
    await page.locator('.inventory_item_name').first().click();
  });

  test('should navigate to product detail page', async ({ page }) => {
    await expect(page).toHaveURL(/inventory-item/);
  });

  test('should display product name, price and description', async ({ page }) => {
    const product = new ProductPage(page);
    await product.expectVisible();
  });

  test('should add product to cart from detail page', async ({ page }) => {
    const product = new ProductPage(page);
    await product.addToCart();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('should show remove button after adding to cart', async ({ page }) => {
    const product = new ProductPage(page);
    await product.addToCart();
    await expect(page.locator('[data-test^="remove"]')).toBeVisible();
  });

  test('should navigate back to inventory', async ({ page }) => {
    const product = new ProductPage(page);
    await product.goBack();
    await expect(page).toHaveURL(/inventory(?!-item)/);
  });
});
