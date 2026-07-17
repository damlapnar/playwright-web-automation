import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productDescription: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('.inventory_details_name');
    this.productDescription = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]');
    this.backButton = page.locator('[data-test="back-to-products"]');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }
  async goBack() {
    await this.backButton.click();
  }

  async expectVisible() {
    // Soft assertions: report on all three fields even if one is missing,
    // instead of stopping at the first failure.
    await expect.soft(this.productName).toBeVisible();
    await expect.soft(this.productPrice).toBeVisible();
    await expect.soft(this.productDescription).toBeVisible();
  }
}
