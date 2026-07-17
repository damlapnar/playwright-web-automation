import { Page } from '@playwright/test';

export async function waitForNetworkIdle(page: Page, timeout = 3000) {
  await page.waitForLoadState('networkidle', { timeout });
}

export function generateRandomEmail(): string {
  const timestamp = Date.now();
  return `testuser_${timestamp}@example.com`;
}

export function generateRandomString(length = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, length + 2);
}

export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({
    path: `reports/screenshots/${name}_${Date.now()}.png`,
    fullPage: true,
  });
}
