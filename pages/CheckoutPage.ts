import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly orderConfirmation: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput  = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton   = page.locator('[data-test="finish"]');
    this.cancelButton   = page.locator('[data-test="cancel"]');
    this.orderConfirmation = page.locator('.complete-header');
  }

  async fillShippingInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue() { await this.continueButton.click(); }
  async finish()   { await this.finishButton.click(); }
  async cancel()   { await this.cancelButton.click(); }

  async expectOrderComplete() {
    await expect(this.orderConfirmation).toHaveText('Thank you for your order!');
  }
}
