import { authenticatedTest as test, expect } from '@fixtures/auth.fixture';
import { products } from '@utils/testData';

test.describe('Navigation & Header', () => {
  test('should display burger menu and cart icon', async ({ navigationPage, page }) => {
    await expect(navigationPage.burgerMenuButton).toBeVisible();
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

  test('should open sidebar menu', async ({ navigationPage }) => {
    await navigationPage.openMenu();
    await navigationPage.expectMenuOpen();
    await expect(navigationPage.inventorySidebarLink).toBeVisible();
  });

  test('should close sidebar menu', async ({ navigationPage }) => {
    await navigationPage.openMenu();
    await navigationPage.expectMenuOpen();
    await navigationPage.closeMenu();
    await navigationPage.expectMenuClosed();
  });

  test('should logout and redirect to login page', async ({ navigationPage, page }) => {
    await navigationPage.logout();
    await expect(page).toHaveURL(/\.com\/$/);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('should reset cart via sidebar', async ({ inventoryPage, navigationPage, page }) => {
    await inventoryPage.addItemToCart(products.backpack);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await navigationPage.resetAppState();
    await expect(page.locator('.shopping_cart_badge')).toBeHidden();
  });
});
