import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  globalSetup: './global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [
        ['list'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['github'],
        ['allure-playwright', { outputFolder: 'allure-results' }],
      ]
    : [['list'], ['html'], ['allure-playwright', { outputFolder: 'allure-results' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    // API tests hit third-party HTTP APIs directly — no browser involved —
    // so they run once here instead of redundantly under every browser
    // project (which would triple their runtime for zero extra coverage).
    { name: 'api', testDir: './tests/api' },
    { name: 'chromium', testIgnore: /tests[\\/]api[\\/]/, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testIgnore: /tests[\\/]api[\\/]/, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testIgnore: /tests[\\/]api[\\/]/, use: { ...devices['Desktop Safari'] } },
    // Mobile projects cover core flows only (login/inventory/cart), not the
    // full suite — running visual/a11y/checkout there too would double the
    // baseline and maintenance burden for marginal extra coverage.
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: /(login|inventory|cart)\.spec\.ts/,
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      testMatch: /(login|inventory|cart)\.spec\.ts/,
    },
  ],
});
