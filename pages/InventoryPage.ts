import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly productList: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly cartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productList = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product_sort_container"]');
    this.cartButton = page.locator('.shopping_cart_link');
  }

  async addItemToCart(itemName: string) {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    await item.locator('button').click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getProductCount(): Promise<number> {
    return await this.productList.count();
  }

  async expectCartCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async goToCart() {
    await this.cartButton.click();
  }
}
