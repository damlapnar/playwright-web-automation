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
    this.sortDropdown = page.locator('select.product_sort_container');
    this.cartButton = page.locator('.shopping_cart_link');
  }

  private itemButton(itemName: string): Locator {
    return this.page.locator('.inventory_item', { hasText: itemName }).locator('button');
  }

  async addItemToCart(itemName: string) {
    await this.itemButton(itemName).click();
  }

  // Sauce Labs toggles the same button between Add/Remove for a given item,
  // so this is the identical click — the shared itemButton() helper keeps
  // that locator logic in one place instead of duplicating it here.
  async removeItemFromCart(itemName: string) {
    await this.itemButton(itemName).click();
  }

  async openProduct(itemName: string) {
    await this.page
      .locator('.inventory_item', { hasText: itemName })
      .locator('.inventory_item_name')
      .click();
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
