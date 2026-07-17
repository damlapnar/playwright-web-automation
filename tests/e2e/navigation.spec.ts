import { authenticatedTest as test, expect } from '@fixtures/auth.fixture';
import { products } from '@utils/testData';

test.describe('Navigation & Header', () => {
  test('should display burger menu and cart icon', async ({ page, inventoryPage: _ }) => {
    await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

  test('should open sidebar menu', async ({ page, inventoryPage: _ }) => {
    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('.bm-menu-wrap')).toBeVisible();
    await expect(page.locator('#inventory_sidebar_link')).toBeVisible();
  });

  test('should close sidebar menu', async ({ page, inventoryPage: _ }) => {
    await page.locator('#react-burger-menu-btn').click();
    await expect(page.locator('.bm-menu-wrap')).toBeVisible();
    await page.locator('#react-burger-cross-btn').click();
    await expect(page.locator('.bm-menu-wrap')).toBeHidden();
  });

  test('should logout and redirect to login page', async ({ page, inventoryPage: _ }) => {
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#logout_sidebar_link').click();
    await expect(page).toHaveURL(/\.com\/$/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('should reset cart via sidebar', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart(products.backpack);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('#reset_sidebar_link').click();
    await expect(page.locator('.shopping_cart_badge')).toBeHidden();
  });
});
