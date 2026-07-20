import { authenticatedTest, cartTest, expect } from '@fixtures/auth.fixture';
import { products } from '@utils/testData';

cartTest.describe('Cart', () => {
  cartTest('should reflect added items', { tag: '@smoke' }, async ({ cartPage }) => {
    await cartPage.expectItemInCart(products.backpack);
    await cartPage.expectItemCount(1);
  });

  cartTest('should remove item from cart', async ({ cartPage }) => {
    await cartPage.removeItem(products.backpack);
    await cartPage.expectEmpty();
  });

  cartTest('cart badge disappears after removing all items', async ({ cartPage, page }) => {
    await cartPage.removeItem(products.backpack);
    await expect(page.locator('.shopping_cart_badge')).toBeHidden();
  });

  cartTest('each cart item shows its price', async ({ cartPage: _c, page }) => {
    await expect(page.locator('.inventory_item_price')).toBeVisible();
    const price = await page.locator('.inventory_item_price').textContent();
    expect(price).toMatch(/\$\d+\.\d{2}/);
  });

  cartTest('continue shopping returns to inventory', async ({ cartPage, page }) => {
    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL(/inventory(?!-item)/);
  });

  cartTest('cart contents survive a page reload', async ({ cartPage, page }) => {
    await page.reload();
    await cartPage.expectItemInCart(products.backpack);
    await cartPage.expectItemCount(1);
  });
});

authenticatedTest.describe('Cart (multiple items)', () => {
  authenticatedTest('supports adding multiple items', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.addItemToCart(products.bikeLight);
    await inventoryPage.goToCart();
    await cartPage.expectItemCount(2);
    await cartPage.expectItemInCart(products.backpack);
    await cartPage.expectItemInCart(products.bikeLight);
  });

  authenticatedTest(
    'removing one of multiple items updates count',
    async ({ inventoryPage, cartPage, page }) => {
      await inventoryPage.addItemToCart(products.backpack);
      await inventoryPage.addItemToCart(products.bikeLight);
      await inventoryPage.goToCart();
      await cartPage.removeItem(products.backpack);
      await cartPage.expectItemCount(1);
      await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    }
  );
});
