import { authenticatedTest as test, expect } from '@fixtures/auth.fixture';
import { products } from '@utils/testData';

test.describe('Product Detail Page', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.openProduct(products.backpack);
  });

  test('should navigate to product detail page', async ({ page }) => {
    await expect(page).toHaveURL(/inventory-item/);
  });

  test('should display product name, price and description', async ({ productPage }) => {
    await productPage.expectVisible();
  });

  test('should add product to cart from detail page', async ({ productPage, page }) => {
    await productPage.addToCart();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('should show remove button after adding to cart', async ({ productPage }) => {
    await productPage.addToCart();
    await expect(productPage.removeFromCartButton).toBeVisible();
  });

  test('should navigate back to inventory', async ({ productPage, page }) => {
    await productPage.goBack();
    await expect(page).toHaveURL(/inventory(?!-item)/);
  });
});
