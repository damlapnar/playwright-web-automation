import { authenticatedTest as test, expect } from '../../fixtures/auth.fixture';
import { CartPage }     from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
  });

  test('should complete checkout with valid shipping info', async ({ page }) => {
    const cart     = new CartPage(page);
    const checkout = new CheckoutPage(page);
    await cart.proceedToCheckout();
    await checkout.fillShippingInfo('Damla', 'Pinar', '10001');
    await checkout.continue();
    await expect(page).toHaveURL(/checkout-step-two/);
    await checkout.finish();
    await checkout.expectOrderComplete();
  });

  test('should show error when first name is missing', async ({ page }) => {
    const cart     = new CartPage(page);
    const checkout = new CheckoutPage(page);
    await cart.proceedToCheckout();
    await checkout.fillShippingInfo('', 'Pinar', '10001');
    await checkout.continue();
    await expect(checkout.errorMessage).toContainText('First Name is required');
  });

  test('should show error when last name is missing', async ({ page }) => {
    const cart     = new CartPage(page);
    const checkout = new CheckoutPage(page);
    await cart.proceedToCheckout();
    await checkout.fillShippingInfo('Damla', '', '10001');
    await checkout.continue();
    await expect(checkout.errorMessage).toContainText('Last Name is required');
  });

  test('should show error when postal code is missing', async ({ page }) => {
    const cart     = new CartPage(page);
    const checkout = new CheckoutPage(page);
    await cart.proceedToCheckout();
    await checkout.fillShippingInfo('Damla', 'Pinar', '');
    await checkout.continue();
    await expect(checkout.errorMessage).toContainText('Postal Code is required');
  });

  test('should show order summary on step two', async ({ page }) => {
    const cart     = new CartPage(page);
    const checkout = new CheckoutPage(page);
    await cart.proceedToCheckout();
    await checkout.fillShippingInfo('Damla', 'Pinar', '10001');
    await checkout.continue();
    await expect(page.locator('.cart_item')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();
  });

  test('should cancel and return to cart', async ({ page }) => {
    const cart     = new CartPage(page);
    const checkout = new CheckoutPage(page);
    await cart.proceedToCheckout();
    await checkout.cancel();
    await expect(page).toHaveURL(/cart/);
  });
});
