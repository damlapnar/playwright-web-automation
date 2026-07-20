import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { CartPage } from '@pages/CartPage';
import { NavigationPage } from '@pages/NavigationPage';
import { ProductPage } from '@pages/ProductPage';
import { CheckoutPage } from '@pages/CheckoutPage';
import { users, products } from '@utils/testData';

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

type AuthWorkerFixtures = {
  authStorageState: string;
};

type AuthPages = Pages & {
  navigationPage: NavigationPage;
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
  cartPage: CartPage;
};

export const authenticatedTest = base.extend<AuthPages, AuthWorkerFixtures>({
  // Logs in through the real UI once per worker instead of once per test —
  // the storageState (cookies/localStorage) is then reused to hand every
  // test in that worker an already-authenticated context, cutting a full
  // login round-trip out of every authenticated test.
  authStorageState: [
    async ({ browser }, use) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      await loginPage.login(users.standard.username, users.standard.password);
      await page.waitForURL('**/inventory.html');
      const storageState = await context.storageState();
      await context.close();
      await use(JSON.stringify(storageState));
    },
    { scope: 'worker' },
  ],

  context: async ({ browser, authStorageState }, use) => {
    const context = await browser.newContext({ storageState: JSON.parse(authStorageState) });
    await use(context);
    await context.close();
  },

  page: async ({ context, baseURL }, use) => {
    const page = await context.newPage();
    await page.goto(`${baseURL}/inventory.html`);
    await use(page);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  navigationPage: async ({ page }, use) => {
    await use(new NavigationPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

// Adds a Sauce Labs Backpack and navigates to the cart page — the common
// starting point for cart, checkout, and page-level a11y/visual specs.
// Overrides the `cartPage` fixture rather than introducing a separate type:
// requesting `cartPage` inside the override resolves authenticatedTest's
// base implementation first, so the POM instance itself isn't duplicated —
// this override only adds the seeding step around it.
export const cartTest = authenticatedTest.extend({
  cartPage: async ({ inventoryPage, cartPage }, use) => {
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.goToCart();
    await use(cartPage);
  },
});

export { expect } from '@playwright/test';
