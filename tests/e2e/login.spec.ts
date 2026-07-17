import { test, expect } from '@fixtures/auth.fixture';
import { users } from '@utils/testData';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('should login with valid credentials', async ({ loginPage, page }) => {
    await loginPage.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);
    await loginPage.expectErrorMessage('Username and password do not match');
  });

  test('should show error for locked out user', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await loginPage.expectErrorMessage('Sorry, this user has been locked out');
  });

  test('should show error when username is missing', async ({ loginPage }) => {
    await loginPage.login('', users.standard.password);
    await loginPage.expectErrorMessage('Username is required');
  });

  test('should show error when password is missing', async ({ loginPage }) => {
    await loginPage.login(users.standard.username, '');
    await loginPage.expectErrorMessage('Password is required');
  });
});
