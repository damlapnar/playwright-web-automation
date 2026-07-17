import { cartTest as test, expect } from '../../fixtures/auth.fixture';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout Flow', () => {
  test('should complete checkout with valid shipping info', async ({ cartPage, page }) => {
    const checkout = new CheckoutPage(page);
    await cartPage.proceedToCheckout();
    await checkout.fillShippingInfo('Damla', 'Pinar', '10001');
    await checkout.continue();
    await expect(page).toHaveURL(/checkout-step-two/);
    await checkout.finish();
    await checkout.expectOrderComplete();
  });

  test('should show error when first name is missing', async ({ cartPage, page }) => {
    const checkout = new CheckoutPage(page);
    await cartPage.proceedToCheckout();
    await checkout.fillShippingInfo('', 'Pinar', '10001');
    await checkout.continue();
    await expect(checkout.errorMessage).toContainText('First Name is required');
  });

  test('should show error when last name is missing', async ({ cartPage, page }) => {
    const checkout = new CheckoutPage(page);
    await cartPage.proceedToCheckout();
    await checkout.fillShippingInfo('Damla', '', '10001');
    await checkout.continue();
    await expect(checkout.errorMessage).toContainText('Last Name is required');
  });

  test('should show error when postal code is missing', async ({ cartPage, page }) => {
    const checkout = new CheckoutPage(page);
    await cartPage.proceedToCheckout();
    await checkout.fillShippingInfo('Damla', 'Pinar', '');
    await checkout.continue();
    await expect(checkout.errorMessage).toContainText('Postal Code is required');
  });

  test('should show order summary on step two', async ({ cartPage, page }) => {
    const checkout = new CheckoutPage(page);
    await cartPage.proceedToCheckout();
    await checkout.fillShippingInfo('Damla', 'Pinar', '10001');
    await checkout.continue();
    await expect(page.locator('.cart_item')).toBeVisible();
    await expect(page.locator('.summary_total_label')).toBeVisible();
  });

  test('should cancel and return to cart', async ({ cartPage, page }) => {
    const checkout = new CheckoutPage(page);
    await cartPage.proceedToCheckout();
    await checkout.cancel();
    await expect(page).toHaveURL(/cart/);
  });
});
