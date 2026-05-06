import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async removeItem(itemName: string) {
    const item = this.page.locator('.cart_item', { hasText: itemName });
    await item.locator('button').click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async expectItemInCart(itemName: string) {
    await expect(this.page.locator('.cart_item', { hasText: itemName })).toBeVisible();
  }
}
