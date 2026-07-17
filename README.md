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
- **Reporting** — HTML + JUnit reports with screenshots and video on failure, plus Allure reports
- **Visual Regression** — screenshot comparisons for key pages
- **Accessibility** — automated axe-core checks for serious/critical violations

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

# Generate + open Allure report (after a test run)
npm run allure:generate
npm run allure:open
```

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions across all three browsers in parallel. Scheduled runs execute every weekday at 8 AM.

---

## Test Architecture

### Why Playwright?
Playwright's async API and built-in auto-waiting eliminate flaky sleeps. Native TypeScript support means compile-time safety across the entire framework. The multi-browser engine (Chromium, Firefox, WebKit) covers a wider matrix than WebDriver-based tools without requiring separate driver binaries.

### Design Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Fixture pattern | Custom `authenticatedTest` | Keeps login state DRY; Playwright lazily instantiates only what each test requests |
| Page Object Model | Typed POMs per page | Encapsulates selectors; tests break at the POM layer not the spec layer |
| API layer separation | `tests/api/` vs `tests/e2e/` | API contract tests run faster and in parallel; E2E tests validate full user flows |
| Parallel execution | Workers per browser | GitHub Actions matrix runs all browsers simultaneously; fail-fast=false catches all regressions |

### Test Pyramid
```
        ┌──────────────────┐
        │   E2E (Playwright)│  ← 6 spec files, full browser
        ├──────────────────┤
        │   API Tests       │  ← 2 spec files, HTTP only
        └──────────────────┘
```

### Adding a New Test
1. Create or update the relevant POM in `pages/`
2. Add the spec in `tests/e2e/` (import `authenticatedTest` for logged-in flows)
3. Run locally: `npx playwright test --project=chromium`

### Running with Docker
```bash
docker build -t pw-tests .
docker run --rm -v $(pwd)/playwright-report:/app/playwright-report pw-tests
```
