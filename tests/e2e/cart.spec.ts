import { authenticatedTest as test, expect } from '../../fixtures/auth.fixture';
import { CartPage } from '../../pages/CartPage';

test.describe('Cart', () => {
  test('should reflect added items', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.expectItemInCart('Sauce Labs Backpack');
    expect(await cartPage.getItemCount()).toBe(1);
  });

  test('should remove item from cart', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.removeItem('Sauce Labs Backpack');
    expect(await cartPage.getItemCount()).toBe(0);
  });

  test('cart badge disappears after removing all items', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.removeItem('Sauce Labs Backpack');
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });
});
