import { test, expect } from '@fixtures/auth.fixture';
import { users } from '@utils/testData';

// saucedemo.com ships demo accounts with permanent, intentional quirks for
// practicing exactly these kinds of checks — not bugs we introduced, and
// not expected to ever get "fixed" upstream.
test.describe('Special Demo Accounts', () => {
  test('problem_user sees broken product images', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.problem.username, users.problem.password);
    await expect(page).toHaveURL(/inventory/);

    const images = page.locator('.inventory_item_img img');
    const sources = await images.evaluateAll((imgs: Array<{ src: string }>) =>
      imgs.map((img) => img.src)
    );

    // problem_user's bug isn't a failed image load (the placeholder file
    // itself loads fine) — every product serves the exact same wrong
    // placeholder image instead of its real photo.
    const uniqueSources = new Set(sources);
    expect(sources.length).toBeGreaterThan(1);
    expect(uniqueSources.size).toBe(1);
  });

  test('performance_glitch_user loads inventory noticeably slower than standard_user', async ({
    loginPage,
    page,
  }) => {
    async function timeLogin(username: string, password: string): Promise<number> {
      await loginPage.navigate();
      const start = Date.now();
      await loginPage.login(username, password);
      await page.waitForURL('**/inventory.html');
      return Date.now() - start;
    }

    const standardMs = await timeLogin(users.standard.username, users.standard.password);
    const glitchMs = await timeLogin(users.performanceGlitch.username, users.standard.password);

    expect(glitchMs).toBeGreaterThan(standardMs * 2);
  });

  test('error_user ignores the sort dropdown selection', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.errorProne.username, users.errorProne.password);
    await expect(page).toHaveURL(/inventory/);

    const defaultOrder = await page.locator('.inventory_item_name').allTextContents();
    await page.locator('select.product_sort_container').selectOption('za');
    // Comparing against the earlier read, not a static expected value —
    // toHaveText() can't express that, so a raw read is the right tool here.
    // eslint-disable-next-line playwright/prefer-web-first-assertions
    const afterSortAttempt = await page.locator('.inventory_item_name').allTextContents();

    // The dropdown visibly changes, but the list order never actually
    // updates for this account — a real, stable saucedemo demo bug.
    expect(afterSortAttempt).toEqual(defaultOrder);
  });
});
