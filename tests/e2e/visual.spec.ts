import { test, authenticatedTest, expect } from '../../fixtures/auth.fixture';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Visual Regression', () => {
  test('login page', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('login page with error', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login('invalid_user', 'wrong_password');
    await expect(page).toHaveScreenshot('login-page-error.png');
  });
});

authenticatedTest.describe('Visual Regression (authenticated)', () => {
  authenticatedTest('inventory page', async ({ inventoryPage, page }) => {
    await expect(page).toHaveScreenshot('inventory-page.png', {
      mask: [page.locator('.shopping_cart_badge')],
    });
  });

  authenticatedTest('cart page with item', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await expect(page).toHaveScreenshot('cart-page.png');
  });

  authenticatedTest('checkout step one', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    const cart = new CartPage(page);
    await cart.proceedToCheckout();
    await expect(page).toHaveScreenshot('checkout-step-one.png');
  });

  authenticatedTest('checkout complete', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);
    await cart.proceedToCheckout();
    await checkout.fillShippingInfo('Damla', 'Pinar', '10001');
    await checkout.continue();
    await checkout.finish();
    await expect(page).toHaveScreenshot('checkout-complete.png');
  });
});
