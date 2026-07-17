import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { test, authenticatedTest, cartTest, expect } from '../../fixtures/auth.fixture';

// saucedemo.com is a third-party demo site with known moderate-impact
// structural issues (no <main> landmark, no h1, content outside landmarks)
// that we have no control over. Scoping to serious/critical keeps this
// suite a useful regression gate instead of permanently red.
const BLOCKING_IMPACTS = ['serious', 'critical'];

async function expectNoBlockingViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  const blocking = results.violations.filter((v) => BLOCKING_IMPACTS.includes(v.impact ?? ''));
  expect(blocking).toEqual([]);
}

test.describe('Accessibility', () => {
  test('login page has no serious/critical violations', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await expectNoBlockingViolations(page);
  });
});

authenticatedTest.describe('Accessibility (authenticated)', () => {
  authenticatedTest(
    'inventory page has no serious/critical violations',
    async ({ inventoryPage: _i, page }) => {
      authenticatedTest.fail(
        true,
        'Known upstream issue: the product sort <select> has no accessible name ' +
          '(axe rule "select-name"). Tracked, not fixable from our side — remove this ' +
          'annotation if saucedemo ever fixes it.'
      );
      await expectNoBlockingViolations(page);
    }
  );

  cartTest('cart page has no serious/critical violations', async ({ cartPage: _c, page }) => {
    await expectNoBlockingViolations(page);
  });

  cartTest('checkout page has no serious/critical violations', async ({ cartPage, page }) => {
    await cartPage.proceedToCheckout();
    await expectNoBlockingViolations(page);
  });
});
