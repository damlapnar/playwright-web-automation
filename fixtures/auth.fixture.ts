import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
});

export const authenticatedTest = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(
      process.env.TEST_USERNAME || 'standard_user',
      process.env.TEST_PASSWORD || 'secret_sauce'
    );
    // Wait for navigation to inventory page to complete before handing off
    await page.waitForURL('**/inventory.html');
    await use(loginPage);
  },
  // depends on loginPage so login and navigation both complete first
  inventoryPage: async ({ page, loginPage: _l }, use) => {
    await use(new InventoryPage(page));
  },
});

type CartPages = Pages & { cartPage: CartPage };

// Adds a Sauce Labs Backpack and navigates to the cart page — the common
// starting point for cart, checkout, and page-level a11y/visual specs.
export const cartTest = authenticatedTest.extend<CartPages>({
  cartPage: async ({ inventoryPage, page }, use) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';
