import { test, expect } from '@fixtures/auth.fixture';

// saucedemo guards every post-login page server-side: an unauthenticated
// direct navigation doesn't redirect anywhere — it stays on the requested
// URL and renders the login form's error banner in its place.
const protectedRoutes = [
  '/inventory.html',
  '/cart.html',
  '/checkout-step-one.html',
  '/checkout-step-two.html',
  '/checkout-complete.html',
];

test.describe('Route protection', () => {
  for (const route of protectedRoutes) {
    const tagOptions = route === '/inventory.html' ? { tag: '@smoke' } : {};

    test(
      `redirects unauthenticated visits to ${route} back to login`,
      tagOptions,
      async ({ page }) => {
        await page.goto(route);
        await expect(page.locator('[data-test="error"]')).toContainText(
          `You can only access '${route}' when you are logged in`
        );
        await expect(page.locator('[data-test="login-button"]')).toBeVisible();
      }
    );
  }
});
