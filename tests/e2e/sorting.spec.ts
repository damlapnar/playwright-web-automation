import { authenticatedTest as test, expect } from '@fixtures/auth.fixture';

test.describe('Product Sorting', () => {
  test('displays all 6 products', async ({ inventoryPage }) => {
    expect(await inventoryPage.getProductCount()).toBe(6);
  });

  test('sort A–Z orders names alphabetically', async ({ inventoryPage, page }) => {
    await inventoryPage.sortBy('az');
    // Comparing the list against its own sort, not a static expected value —
    // toHaveText() can't express that, so a raw read is the right tool here.
    // eslint-disable-next-line playwright/prefer-web-first-assertions
    const names = await page.locator('.inventory_item_name').allTextContents();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('sort Z–A reverses alphabetical order', async ({ inventoryPage, page }) => {
    await inventoryPage.sortBy('za');
    // eslint-disable-next-line playwright/prefer-web-first-assertions
    const names = await page.locator('.inventory_item_name').allTextContents();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('sort low–high orders prices ascending', async ({ inventoryPage, page }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const nums = prices.map((p) => parseFloat(p.replace('$', '')));
    expect(nums).toEqual([...nums].sort((a, b) => a - b));
  });

  test('sort high–low orders prices descending', async ({ inventoryPage, page }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const nums = prices.map((p) => parseFloat(p.replace('$', '')));
    expect(nums).toEqual([...nums].sort((a, b) => b - a));
  });

  test('switching sort options updates the list', async ({ inventoryPage, page }) => {
    await inventoryPage.sortBy('az');
    const firstAZ = await page.locator('.inventory_item_name').first().textContent();
    await inventoryPage.sortBy('za');
    const firstZA = await page.locator('.inventory_item_name').first().textContent();
    // Both reads must resolve to plain strings before comparing — a Locator
    // re-queries live DOM, so it would reflect the 'za' state by the time
    // it's evaluated, comparing the same state against itself.
    // eslint-disable-next-line playwright/prefer-web-first-assertions
    expect(firstAZ).not.toEqual(firstZA);
  });
});
