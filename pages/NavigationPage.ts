import { Page, Locator, expect } from '@playwright/test';

export class NavigationPage {
  readonly page: Page;
  readonly burgerMenuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly menu: Locator;
  readonly inventorySidebarLink: Locator;
  readonly aboutSidebarLink: Locator;
  readonly logoutSidebarLink: Locator;
  readonly resetSidebarLink: Locator;
  readonly footer: Locator;
  readonly socialTwitterLink: Locator;
  readonly socialFacebookLink: Locator;
  readonly socialLinkedinLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.menu = page.locator('.bm-menu-wrap');
    this.inventorySidebarLink = page.locator('#inventory_sidebar_link');
    this.aboutSidebarLink = page.locator('#about_sidebar_link');
    this.logoutSidebarLink = page.locator('#logout_sidebar_link');
    this.resetSidebarLink = page.locator('#reset_sidebar_link');
    this.footer = page.locator('.footer');
    this.socialTwitterLink = page.locator('.social_twitter a');
    this.socialFacebookLink = page.locator('.social_facebook a');
    this.socialLinkedinLink = page.locator('.social_linkedin a');
  }

  async openMenu() {
    await this.burgerMenuButton.click();
  }

  async closeMenu() {
    await this.closeMenuButton.click();
  }

  async logout() {
    await this.openMenu();
    await this.logoutSidebarLink.click();
  }

  async resetAppState() {
    await this.openMenu();
    await this.resetSidebarLink.click();
  }

  async expectMenuOpen() {
    await expect(this.menu).toBeVisible();
  }

  async expectMenuClosed() {
    await expect(this.menu).toBeHidden();
  }
}
