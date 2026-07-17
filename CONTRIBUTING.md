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

## Linting & Formatting

```bash
npm run lint          # ESLint (includes eslint-plugin-playwright rules)
npm run lint:fix
npm run format:check  # Prettier
npm run format
```

Both run in CI as a required check before the test matrix.

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
