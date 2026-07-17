import { authenticatedTest as test, expect } from '../../fixtures/auth.fixture';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Checkout', () => {
  test('should complete checkout with valid information', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillInfo('Damla', 'Pinar', '34000');
    await checkoutPage.continueToOverview();
    expect(await checkoutPage.getSummaryItemCount()).toBe(1);

    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
  });

  test('should show error when first name is missing', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillInfo('', 'Pinar', '34000');
    await checkoutPage.continueToOverview();
    await checkoutPage.expectErrorMessage('First Name is required');
  });

  test('should show error when last name is missing', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillInfo('Damla', '', '34000');
    await checkoutPage.continueToOverview();
    await checkoutPage.expectErrorMessage('Last Name is required');
  });

  test('should show error when postal code is missing', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillInfo('Damla', 'Pinar', '');
    await checkoutPage.continueToOverview();
    await checkoutPage.expectErrorMessage('Postal Code is required');
  });

  test('should cancel checkout and return to cart', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.cancelButton.click();
    await expect(page).toHaveURL(/cart/);
  });
});
