# Playwright Web Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
[![CI](https://github.com/damlapnar/playwright-web-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/damlapnar/playwright-web-automation/actions/workflows/playwright.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

End-to-end web automation framework built with Playwright and TypeScript. Features Page Object Model, custom fixtures, parallel cross-browser execution, and full CI/CD integration via GitHub Actions.

## Features

- **Page Object Model** — maintainable, reusable page abstractions
- **Cross-browser** — Chromium, Firefox, WebKit, mobile viewports
- **Custom Fixtures** — pre-authenticated test contexts
- **API Testing** — built-in Playwright request context
- **Parallel Execution** — configurable worker count
- **CI/CD** — GitHub Actions with matrix strategy per browser
- **Reporting** — HTML + JUnit reports with screenshots and video on failure

## Project Structure

```
playwright-web-automation/
├── pages/               # Page Object classes
├── tests/
│   ├── e2e/             # End-to-end UI tests
│   └── api/             # API tests
├── fixtures/            # Custom test fixtures
├── utils/               # Helper functions
├── .github/workflows/   # CI/CD pipeline
└── playwright.config.ts
```

## Getting Started

```bash
npm install
npx playwright install
cp .env.example .env
```

## Running Tests

```bash
# All tests
npm test

# Headed mode (see browser)
npm run test:headed

# Specific browser
npm run test:chrome
npm run test:firefox
npm run test:safari

# API tests only
npm run test:api

# Debug mode
npm run test:debug

# View HTML report
npm run report
```

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions across all three browsers in parallel. Scheduled runs execute every weekday at 8 AM.
