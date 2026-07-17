import { authenticatedTest as test, expect } from '../../fixtures/auth.fixture';
import { CartPage } from '../../pages/CartPage';

test.describe('Cart', () => {
  test('should reflect added items', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    const cart = new CartPage(page);
    await cart.expectItemInCart('Sauce Labs Backpack');
    expect(await cart.getItemCount()).toBe(1);
  });

  test('should remove item from cart', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    const cart = new CartPage(page);
    await cart.removeItem('Sauce Labs Backpack');
    expect(await cart.getItemCount()).toBe(0);
  });

  test('cart badge disappears after removing all items', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    const cart = new CartPage(page);
    await cart.removeItem('Sauce Labs Backpack');
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('supports adding multiple items', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    const cart = new CartPage(page);
    expect(await cart.getItemCount()).toBe(2);
    await cart.expectItemInCart('Sauce Labs Backpack');
    await cart.expectItemInCart('Sauce Labs Bike Light');
  });

  test('each cart item shows its price', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await expect(page.locator('.inventory_item_price')).toBeVisible();
    const price = await page.locator('.inventory_item_price').textContent();
    expect(price).toMatch(/\$\d+\.\d{2}/);
  });

  test('continue shopping returns to inventory', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    const cart = new CartPage(page);
    await cart.continueShoppingButton.click();
    await expect(page).toHaveURL(/inventory(?!-item)/);
  });

  test('removing one of multiple items updates count', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.goToCart();
    const cart = new CartPage(page);
    await cart.removeItem('Sauce Labs Backpack');
    expect(await cart.getItemCount()).toBe(1);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});
