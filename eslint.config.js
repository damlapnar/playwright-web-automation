const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const playwright = require('eslint-plugin-playwright');
const globals = require('globals');
const prettier = require('eslint-config-prettier');

module.exports = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'allure-report/**',
      'allure-results/**',
    ],
  },
  {
    files: ['*.config.js'],
    languageOptions: { globals: globals.node },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    settings: {
      playwright: {
        // fixtures/auth.fixture.ts extends `test` under these names
        globalAliases: { test: ['authenticatedTest', 'cartTest'] },
      },
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Page Objects wrap their expect() calls in expectXyz() helpers
      // (e.g. LoginPage.expectErrorMessage) — teach the rule to look there
      // instead of flagging every test that uses one as assertion-free.
      'playwright/expect-expect': ['warn', { assertFunctionPatterns: ['^expect'] }],
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  }
);
