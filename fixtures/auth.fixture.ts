import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { InventoryPage } from '@pages/InventoryPage';
import { CartPage } from '@pages/CartPage';
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

export const authenticatedTest = base.extend<Pages, AuthWorkerFixtures>({
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
});

type CartPages = Pages & { cartPage: CartPage };

// Adds a Sauce Labs Backpack and navigates to the cart page — the common
// starting point for cart, checkout, and page-level a11y/visual specs.
export const cartTest = authenticatedTest.extend<CartPages>({
  cartPage: async ({ inventoryPage, page }, use) => {
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.goToCart();
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';
