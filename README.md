# Playwright Web Automation Framework

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
[![CI](https://github.com/damlapnar/playwright-web-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/damlapnar/playwright-web-automation/actions/workflows/playwright.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

End-to-end web automation framework built with Playwright and TypeScript. Features Page Object Model, custom fixtures, parallel cross-browser execution, and full CI/CD integration via GitHub Actions.

## Features

- **Page Object Model** — maintainable, reusable page abstractions
- **Cross-browser** — Chromium, Firefox, WebKit, mobile viewports
- **Custom Fixtures** — pre-authenticated test contexts (UI and API)
- **API Testing** — typed request clients (the API equivalent of Page Objects) covering two providers: auth/users/products/carts CRUD, contract/resilience checks, and negative cases — run in a dedicated browser-less CI lane
- **Parallel Execution** — configurable worker count
- **CI/CD** — GitHub Actions with matrix strategy per browser
- **Reporting** — HTML, JSON, and Allure reports with screenshots and video on failure
- **Visual Regression** — screenshot comparisons for key pages
- **Accessibility** — automated axe-core checks for serious/critical violations
- **Linting & Formatting** — ESLint (with Playwright-specific rules) and Prettier, enforced in CI
- **Auth State Reuse** — logs in once per worker via storageState instead of once per test
- **Network Interception** — examples of blocking/delaying requests with `page.route()`
- **Smoke Tagging** — `@smoke` tags a small critical-path subset for fast iteration (`npm run test:smoke`); everything else is implicit full regression
- **Pre-commit Hooks** — Husky + lint-staged run ESLint/Prettier on staged files before every commit
- **Dependency Automation** — Dependabot keeps npm and GitHub Actions dependencies current; `npm audit` + dependency review gate CI

## Project Structure

```
playwright-web-automation/
├── pages/               # Page Object classes (UI)
├── api/                 # Typed API request clients (Auth/Users/Products/Carts/Posts)
├── tests/
│   ├── e2e/             # End-to-end UI tests
│   └── api/             # API tests — auth, CRUD, contract/resilience
├── fixtures/            # Custom test fixtures (UI auth reuse + API clients/tokens)
├── utils/               # Shared test data
├── .github/
│   ├── workflows/       # CI/CD pipelines
│   └── dependabot.yml
├── global-setup.ts      # Fails fast if BASE_URL is unreachable
├── eslint.config.js
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

# Mobile viewports (login/inventory/cart flows only)
npm run test:mobile-chrome
npm run test:mobile-safari

# API tests only
npm run test:api

# Smoke subset only (fast critical-path check)
npm run test:smoke

# Debug mode
npm run test:debug

# View HTML report
npm run report

# Generate + open Allure report (after a test run)
npm run allure:generate
npm run allure:open
```

## CI/CD

Tests run automatically on every push and pull request via GitHub Actions across the `api` project plus all three desktop browsers and mobile Chrome/Safari, all in parallel. Scheduled runs execute every weekday at 8 AM. Node modules and Playwright browser binaries are cached between runs, and each job is capped with `timeout-minutes` so a hung test can't silently block CI for hours.

Each job's step summary reports pass/fail counts, lists any failed test titles, and flags any test that only passed after a retry, so instability that CI's `retries: 2` would otherwise silently absorb stays visible.

---

## Test Architecture

### Why Playwright?

Playwright's async API and built-in auto-waiting eliminate flaky sleeps. Native TypeScript support means compile-time safety across the entire framework. The multi-browser engine (Chromium, Firefox, WebKit) covers a wider matrix than WebDriver-based tools without requiring separate driver binaries.

### Design Decisions

| Decision               | Choice                                                                | Rationale                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Fixture pattern        | Custom `authenticatedTest` / `cartTest` / `apiTest` / `authedApiTest` | Keeps setup DRY; Playwright lazily instantiates only what each test requests                                                                |
| Auth reuse (UI)        | Worker-scoped `storageState`                                          | Logs in once per worker instead of once per test — full local suite dropped from ~23s to ~16s                                               |
| Auth reuse (API)       | Worker-scoped access token                                            | `authedApiTest` logs in once per worker for the one endpoint (`/auth/me`) that actually requires a token                                    |
| Page Object Model      | Typed POMs per page                                                   | Encapsulates selectors; tests break at the POM layer not the spec layer                                                                     |
| API client layer       | Typed request clients in `api/`                                       | The API equivalent of the POM — specs call `usersClient.search(...)`, not raw URLs; a resource's shape changes in one place                 |
| API layer separation   | `tests/api/` vs `tests/e2e/`                                          | API contract tests run faster and in parallel; E2E tests validate full user flows                                                           |
| API runs once, not 3x  | Dedicated `api` Playwright project                                    | API tests don't touch a browser; a `testIgnore` on the browser projects plus a browser-less `api` project stops them re-running per browser |
| Parallel execution     | Workers per browser project                                           | GitHub Actions matrix runs all 6 projects simultaneously; fail-fast=false catches all regressions                                           |
| Path aliases           | `@pages/*`, `@fixtures/*`, `@utils/*`, `@api/*`                       | Playwright resolves tsconfig paths natively; avoids `../../` chains                                                                         |
| Docker browser install | `playwright install` at build time                                    | Browsers always match whatever `@playwright/test` resolves to — can't silently drift like a pinned tag                                      |

### Test Pyramid

```
        ┌──────────────────┐
        │   E2E (Playwright)│  ← 12 spec files, full browser
        ├──────────────────┤
        │   API Tests       │  ← 6 spec files, HTTP only, two providers
        └──────────────────┘
```

### API Test Coverage

`tests/api/` exercises two live public APIs through the typed clients in `api/`:

| Spec                   | Covers                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------- |
| `auth-api.spec.ts`     | Login, JWT expiry, refresh-token exchange, `/auth/me`, invalid/missing credentials                   |
| `users-api.spec.ts`    | CRUD, pagination, `select`, `sortBy`, search, filter, negative/injection-shaped input                |
| `products-api.spec.ts` | CRUD, categories, category filtering, search, sort                                                   |
| `carts-api.spec.ts`    | CRUD, computed cart/product totals, merge semantics                                                  |
| `contract-api.spec.ts` | Content-type headers, response-time budget, malformed bodies, oversized/negative ids, unknown routes |
| `posts-api.spec.ts`    | A second provider (jsonplaceholder) — CRUD, nested comments resource                                 |

### Adding a New Test

**UI:**

1. Create or update the relevant POM in `pages/`
2. Add the spec in `tests/e2e/` (import `authenticatedTest` for logged-in flows — it exposes `loginPage`, `inventoryPage`, `navigationPage`, `productPage`, `checkoutPage`, and an unseeded `cartPage` as fixtures; `cartTest` additionally seeds one item into `cartPage` before the test body runs)
3. Run locally: `npx playwright test --project=chromium`

**API:**

1. Add or extend a typed client in `api/` (constructor takes an `APIRequestContext`, one method per endpoint)
2. Add the spec in `tests/api/`, importing `apiTest`/`authedApiTest` from `@fixtures/api.fixture` — never call `request.get(...)` with a raw URL string directly in a spec
3. Run locally: `npm run test:api`

### Running with Docker

```bash
docker build -t pw-tests .
docker run --rm -v $(pwd)/playwright-report:/app/playwright-report pw-tests
```
