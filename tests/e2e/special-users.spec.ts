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

  test('performance_glitch_user login takes noticeably longer than normal', async ({
    loginPage,
    page,
  }) => {
    await loginPage.navigate();
    const start = Date.now();
    await loginPage.login(users.performanceGlitch.username, users.standard.password);
    await page.waitForURL('**/inventory.html');
    const elapsedMs = Date.now() - start;

    // saucedemo bakes a fixed ~5s artificial delay into this account's
    // login. An absolute floor is robust to CI load noise in a way that
    // comparing against a second live standard_user login round trip
    // isn't — and it cuts an entire extra login out of the test.
    expect(elapsedMs).toBeGreaterThan(3000);
  });

  test('error_user ignores the sort dropdown selection', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    await loginPage.navigate();
    await loginPage.login(users.errorProne.username, users.errorProne.password);
    await expect(page).toHaveURL(/inventory/);

    const defaultOrder = await page.locator('.inventory_item_name').allTextContents();
    await inventoryPage.sortBy('za');
    // Comparing against the earlier read, not a static expected value —
    // toHaveText() can't express that, so a raw read is the right tool here.
    // eslint-disable-next-line playwright/prefer-web-first-assertions
    const afterSortAttempt = await page.locator('.inventory_item_name').allTextContents();

    // The dropdown visibly changes, but the list order never actually
    // updates for this account — a real, stable saucedemo demo bug.
    expect(afterSortAttempt).toEqual(defaultOrder);
  });

  test('visual_user renders an oversized cart icon', async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.login(users.visual.username, users.visual.password);
    await expect(page).toHaveURL(/inventory/);

    const cartIconSize = await page
      .locator('.shopping_cart_link')
      .evaluate((el) => el.getBoundingClientRect().width);

    // standard_user's cart icon is exactly 40x40px; visual_user's is a
    // deliberately different ~42px — a real, stable layout regression this
    // demo account exists to exercise.
    expect(cartIconSize).toBeGreaterThan(41);
  });
});
