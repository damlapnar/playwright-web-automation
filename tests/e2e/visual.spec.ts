import { test, authenticatedTest, cartTest, expect } from '../../fixtures/auth.fixture';
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

  cartTest('cart page with item', async ({ cartPage: _c, page }) => {
    await expect(page).toHaveScreenshot('cart-page.png');
  });

  cartTest('checkout step one', async ({ cartPage, page }) => {
    await cartPage.proceedToCheckout();
    await expect(page).toHaveScreenshot('checkout-step-one.png');
  });

  cartTest('checkout complete', async ({ cartPage, page }) => {
    const checkout = new CheckoutPage(page);
    await cartPage.proceedToCheckout();
    await checkout.fillShippingInfo('Damla', 'Pinar', '10001');
    await checkout.continue();
    await checkout.finish();
    await expect(page).toHaveScreenshot('checkout-complete.png');
  });
});
