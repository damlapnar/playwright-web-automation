import { cartTest as test, authenticatedTest, expect } from '@fixtures/auth.fixture';
import { products, shippingInfo } from '@utils/testData';

const { firstName, lastName, postalCode } = shippingInfo.valid;

test.describe('Checkout Flow', () => {
  test(
    'should complete checkout with valid shipping info',
    { tag: '@smoke' },
    async ({ cartPage, checkoutPage, page }) => {
      await test.step('proceed from cart to checkout', async () => {
        await cartPage.proceedToCheckout();
      });

      await test.step('submit shipping information', async () => {
        await checkoutPage.fillShippingInfo(firstName, lastName, postalCode);
        await checkoutPage.continue();
        await expect(page).toHaveURL(/checkout-step-two/);
      });

      await test.step('finish the order', async () => {
        await checkoutPage.finish();
        await checkoutPage.expectOrderComplete();
      });
    }
  );

  test('should show error when first name is missing', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo('', lastName, postalCode);
    await checkoutPage.continue();
    await checkoutPage.expectErrorMessage('First Name is required');
  });

  test('should show error when last name is missing', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(firstName, '', postalCode);
    await checkoutPage.continue();
    await checkoutPage.expectErrorMessage('Last Name is required');
  });

  test('should show error when postal code is missing', async ({ cartPage, checkoutPage }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(firstName, lastName, '');
    await checkoutPage.continue();
    await checkoutPage.expectErrorMessage('Postal Code is required');
  });

  test('should show order summary on step two', async ({ cartPage, checkoutPage, page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(firstName, lastName, postalCode);
    await checkoutPage.continue();
    await expect(page.locator('.cart_item')).toBeVisible();
    await expect(checkoutPage.totalLabel).toBeVisible();
  });

  test('should cancel and return to cart', async ({ cartPage, checkoutPage, page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.cancel();
    await expect(page).toHaveURL(/cart/);
  });

  test('browser back button from checkout step one returns to cart with items intact', async ({
    cartPage,
    page,
  }) => {
    await cartPage.proceedToCheckout();
    await page.goBack();
    await expect(page).toHaveURL(/cart/);
    await cartPage.expectItemInCart(products.backpack);
  });
});

authenticatedTest.describe('Checkout edge cases', () => {
  authenticatedTest(
    'subtotal, tax, and total reflect multiple cart items',
    async ({ inventoryPage, cartPage, checkoutPage, page }) => {
      // Uses authenticatedTest (not cartTest) so both items can be added from
      // the inventory page before ever navigating to the cart — cartTest's
      // fixture already seeds one item and leaves you on the cart page, where
      // InventoryPage's locators don't resolve.
      await authenticatedTest.step('add two items and start checkout', async () => {
        await inventoryPage.addItemToCart(products.backpack);
        await inventoryPage.addItemToCart(products.bikeLight);
        await inventoryPage.goToCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.fillShippingInfo(firstName, lastName, postalCode);
        await checkoutPage.continue();
      });

      await authenticatedTest.step('verify order math', async () => {
        const itemPrices = await page.locator('.inventory_item_price').allTextContents();
        const expectedSubtotal = itemPrices
          .map((price) => parseFloat(price.replace('$', '')))
          .reduce((sum, price) => sum + price, 0);

        const [subtotal, tax, total] = await Promise.all([
          checkoutPage.getSubtotal(),
          checkoutPage.getTax(),
          checkoutPage.getTotal(),
        ]);
        expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
        expect(tax).toBeGreaterThan(0);
        expect(total).toBeCloseTo(subtotal + tax, 2);
      });
    }
  );

  // saucedemo doesn't guard the checkout button on cart size — it stays
  // enabled and the flow completes with a $0.00 total, verified live.
  authenticatedTest(
    'checkout completes with zero items in cart',
    async ({ page, checkoutPage }) => {
      await page.goto('/cart.html');
      await page.locator('[data-test="checkout"]').click();
      await checkoutPage.fillShippingInfo(firstName, lastName, postalCode);
      await checkoutPage.continue();
      await expect(page.locator('.cart_item')).toHaveCount(0);
      expect(await checkoutPage.getTotal()).toBe(0);
    }
  );
});
