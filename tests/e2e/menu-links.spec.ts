import { authenticatedTest as test, expect } from '@fixtures/auth.fixture';

// Covers the sidebar's external link and the footer — chrome that every
// other spec navigates past but nothing previously asserted on directly.
test.describe('Menu & Footer Links', () => {
  test('About sidebar link points to the Sauce Labs site', async ({ navigationPage }) => {
    await navigationPage.openMenu();
    await expect(navigationPage.aboutSidebarLink).toHaveAttribute('href', 'https://saucelabs.com/');
  });

  test('footer displays the copyright notice', async ({ navigationPage }) => {
    await expect(navigationPage.footer).toBeVisible();
    await expect(navigationPage.footer).toContainText('Sauce Labs');
    await expect(navigationPage.footer).toContainText('All Rights Reserved');
  });

  test('footer social links each point to an external page', async ({ navigationPage }) => {
    // Asserting only "external, non-empty https link" rather than an exact
    // domain — the social platforms themselves (and their domains) are
    // outside this app's control and free to change independently of it.
    for (const link of [
      navigationPage.socialTwitterLink,
      navigationPage.socialFacebookLink,
      navigationPage.socialLinkedinLink,
    ]) {
      const href = await link.getAttribute('href');
      expect(href).toMatch(/^https:\/\//);
    }
  });
});
