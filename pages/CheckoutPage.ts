import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly finishButton: Locator;
  readonly summaryItems: Locator;
  readonly totalLabel: Locator;
  readonly completeHeader: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.summaryItems = page.locator('.cart_item');
    this.totalLabel = page.locator('.summary_total_label');
    this.completeHeader = page.locator('.complete-header');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  async fillInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async expectOrderComplete() {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async getSummaryItemCount(): Promise<number> {
    return await this.summaryItems.count();
  }
}
