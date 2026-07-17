import { test, expect } from '@fixtures/auth.fixture';
import { users } from '@utils/testData';

test.describe('Network Interception', () => {
  test('blocks third-party analytics beacons without breaking the login flow', async ({
    loginPage,
    page,
  }) => {
    const analyticsRequests: string[] = [];

    // saucedemo.com fires telemetry beacons to events.backtrace.io on every
    // page load. Blocking third-party analytics/telemetry in E2E tests is
    // standard practice — it removes a dependency on a service we don't
    // control and don't care about, and one less real network call per
    // test is one less source of flakiness.
    await page.route('**://events.backtrace.io/**', (route) => {
      analyticsRequests.push(route.request().url());
      return route.abort();
    });

    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);

    expect(analyticsRequests.length).toBeGreaterThan(0);
  });

  test('mocks a slow font request without blocking the login flow', async ({ loginPage, page }) => {
    // Delays (rather than blocks) a request to prove the app's critical
    // path — login — doesn't depend on a decorative third-party resource.
    await page.route('**://fonts.gstatic.com/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await route.continue();
    });

    await loginPage.navigate();
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/, { timeout: 10_000 });
  });
});
