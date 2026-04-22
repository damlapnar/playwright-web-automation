import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should login with valid credentials', async ({ loginPage, page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login('invalid_user', 'wrong_password');
    await loginPage.expectErrorMessage('Username and password do not match');
  });

  test('should show error for locked out user', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await loginPage.expectErrorMessage('Sorry, this user has been locked out');
  });

  test('should show error when username is missing', async ({ loginPage }) => {
    await loginPage.login('', 'secret_sauce');
    await loginPage.expectErrorMessage('Username is required');
  });

  test('should show error when password is missing', async ({ loginPage }) => {
    await loginPage.login('standard_user', '');
    await loginPage.expectErrorMessage('Password is required');
  });
});
