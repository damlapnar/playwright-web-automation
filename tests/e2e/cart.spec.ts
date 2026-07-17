import { authenticatedTest, cartTest, expect } from '../../fixtures/auth.fixture';
import { CartPage } from '../../pages/CartPage';
import { products } from '../../utils/testData';

cartTest.describe('Cart', () => {
  cartTest('should reflect added items', async ({ cartPage }) => {
    await cartPage.expectItemInCart(products.backpack);
    expect(await cartPage.getItemCount()).toBe(1);
  });

  cartTest('should remove item from cart', async ({ cartPage }) => {
    await cartPage.removeItem(products.backpack);
    expect(await cartPage.getItemCount()).toBe(0);
  });

  cartTest('cart badge disappears after removing all items', async ({ cartPage, page }) => {
    await cartPage.removeItem(products.backpack);
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
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
});

authenticatedTest.describe('Cart (multiple items)', () => {
  authenticatedTest('supports adding multiple items', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.addItemToCart(products.bikeLight);
    await inventoryPage.goToCart();
    const cart = new CartPage(page);
    expect(await cart.getItemCount()).toBe(2);
    await cart.expectItemInCart(products.backpack);
    await cart.expectItemInCart(products.bikeLight);
  });

  authenticatedTest('removing one of multiple items updates count', async ({ inventoryPage, page }) => {
    await inventoryPage.addItemToCart(products.backpack);
    await inventoryPage.addItemToCart(products.bikeLight);
    await inventoryPage.goToCart();
    const cart = new CartPage(page);
    await cart.removeItem(products.backpack);
    expect(await cart.getItemCount()).toBe(1);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });
});
