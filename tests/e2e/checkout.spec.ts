import { cartTest as test, expect } from '@fixtures/auth.fixture';
import { CheckoutPage } from '@pages/CheckoutPage';
import { shippingInfo } from '@utils/testData';

const { firstName, lastName, postalCode } = shippingInfo.valid;

test.describe('Checkout Flow', () => {
  test('should complete checkout with valid shipping info', async ({ cartPage, page }) => {
    const checkout = new CheckoutPage(page);

    await test.step('proceed from cart to checkout', async () => {
      await cartPage.proceedToCheckout();
    });

    await test.step('submit shipping information', async () => {
      await checkout.fillShippingInfo(firstName, lastName, postalCode);
      await checkout.continue();
      await expect(page).toHaveURL(/checkout-step-two/);
    });

    await test.step('finish the order', async () => {
      await checkout.finish();
      await checkout.expectOrderComplete();
    });
  });

  test('should show error when first name is missing', async ({ cartPage, page }) => {
    const checkout = new CheckoutPage(page);
    await cartPage.proceedToCheckout();
    await checkout.fillShippingInfo('', lastName, postalCode);
    await checkout.continue();
    await expect(checkout.errorMessage).toContainText('First Name is required');
  });

  test('should show error when last name is missing', async ({ cartPage, page }) => {
    const checkout = new CheckoutPage(page);
    await cartPage.proceedToCheckout();
    await checkout.fillShippingInfo(firstName, '', postalCode);
    await checkout.continue();
    await expect(checkout.errorMessage).toContainText('Last Name is required');
  });

  test('should show error when postal code is missing', async ({ cartPage, page }) => {
    const checkout = new CheckoutPage(page);
    await cartPage.proceedToCheckout();
    await checkout.fillShippingInfo(firstName, lastName, '');
    await checkout.continue();
    await expect(checkout.errorMessage).toContainText('Postal Code is required');
  });

  test('should show order summary on step two', async ({ cartPage, page }) => {
    const checkout = new CheckoutPage(page);
    await cartPage.proceedToCheckout();
    await checkout.fillShippingInfo(firstName, lastName, postalCode);
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
