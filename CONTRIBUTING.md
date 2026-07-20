# Contributing to playwright-web-automation

Thank you for your interest in contributing!

## Getting Started

```bash
git clone https://github.com/damlapnar/playwright-web-automation.git
cd playwright-web-automation
npm install
npx playwright install
```

## Running Tests

```bash
npm test

# Headed mode (see the browser)
npm run test:headed

# Step through a test in the Playwright inspector
npm run test:debug

# Interactive UI mode (time-travel through steps, watch mode)
npm run test:ui
```

## Visual Regression Tests

`tests/e2e/visual.spec.ts` compares pages against baseline screenshots via
`toHaveScreenshot()`. Baselines are OS- and browser-specific (e.g.
`login-page-chromium-linux.png`), so macOS-generated baselines won't match
in CI (which runs on `ubuntu-latest`).

To (re)generate the Linux baselines after adding or intentionally changing a
page under visual test:

1. Run the **Update Visual Snapshots** workflow manually from the Actions tab
   (`workflow_dispatch`).
2. Download the `visual-snapshots-<browser>` artifacts.
3. Copy their contents into `tests/e2e/visual.spec.ts-snapshots/`.
4. Review the diffs and commit.

To update your local macOS baselines instead, run:

```bash
npx playwright test tests/e2e/visual.spec.ts --update-snapshots
```

## Authenticated Tests

`fixtures/auth.fixture.ts` exports three test objects:

- `test` — no login. Exposes `loginPage`/`inventoryPage`. Use for the login
  page itself (`login.spec.ts`) and unauthenticated flows
  (`route-protection.spec.ts`).
- `authenticatedTest` — logs in through the real UI **once per worker**
  (not once per test) via a worker-scoped `authStorageState` fixture, then
  hands each test a fresh context/page already loaded with that
  storageState. Its `page` fixture navigates straight to `/inventory.html`.
  Exposes `loginPage`, `inventoryPage`, `navigationPage`, `productPage`,
  `checkoutPage`, and an unseeded `cartPage`.
- `cartTest` — extends `authenticatedTest` by overriding the `cartPage`
  fixture: it adds a Sauce Labs Backpack and navigates to the cart page
  before the test body runs, then hands back the same `cartPage` instance.
  Use `authenticatedTest` directly (not `cartTest`) for tests that need
  custom cart seeding, e.g. multiple items or an intentionally empty cart.

Because Playwright fixtures are lazy, a fixture only runs if something in
the test actually requests it. If your test needs a fixture's side effect
but not its return value, destructure it anyway with an underscore-prefixed
name (e.g. `cartPage: _c`) — `eslint.config.js` allows unused args matching
`^_`. Forgetting this is a real, recurring bug in this codebase: the test
silently runs against `about:blank` or a not-yet-authenticated page instead
of failing loudly.

## Linting & Formatting

```bash
npm run lint          # ESLint (includes eslint-plugin-playwright rules)
npm run lint:fix
npm run format:check  # Prettier
npm run format
```

Both run in a dedicated CI `lint` job, in parallel with the browser test
matrix (not gating it — a lint failure won't stop the test matrix from
also reporting its own results).

## Pre-commit Hooks

`npm install` wires up a Husky pre-commit hook (via the `prepare` script)
that runs `lint-staged` on every commit: `eslint --fix` + `prettier --write`
on staged `*.ts` files, and `prettier --write` on staged
`*.{md,json,yml,yaml}` files. This catches most lint/format issues locally,
before the CI `lint` job would otherwise catch them.

If you need to bypass it for a specific commit (rare — e.g. a WIP commit on
a private branch), use `git commit --no-verify`. This is discouraged for
anything headed toward a PR, since CI enforces the same checks anyway.

## Scaling CI with Sharding

The current suite (282 tests across 6 projects) runs comfortably in one job
per project. If it grows large enough that a single project's run becomes
the bottleneck, Playwright can split a project's tests across multiple
machines:

```bash
npx playwright test --project=chromium --shard=1/3
npx playwright test --project=chromium --shard=2/3
npx playwright test --project=chromium --shard=3/3
```

Each shard runs a disjoint subset of that project's tests; wire it up as an
extra matrix dimension (`shard: [1, 2, 3]`) crossed with `project` in
`.github/workflows/playwright.yml` when it's actually needed — don't add it
preemptively for a suite this size, it would only add job-scheduling
overhead for no real wall-clock gain.

## Guidelines

- Follow the existing code style and naming conventions
- Add tests for any new functionality
- Keep commits small and focused with descriptive messages
- Open an issue before submitting large changes

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes with a descriptive message
4. Push to your fork and open a Pull Request against `main`
5. Ensure all CI checks pass

## Reporting Bugs

Open a GitHub Issue with:

- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, browser/runtime version)
