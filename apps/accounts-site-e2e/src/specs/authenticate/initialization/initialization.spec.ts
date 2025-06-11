import { test, expect } from '@playwright/test';
import { AuthenticateInitializationPage } from '../../../pages/authenticate/initialization.page';
import { ACCOUNTS_SITE_URL } from '../../../utils/domains';
import { TestDataGenerator } from '../../../utils/test-data-generator';

test.describe('Initialization Page', { tag: ['@accounts-site', '@authentication', '@initialization'] }, () => {
  let newUserEmail: string;

  test.beforeEach(async ({ page }) => {
    newUserEmail = TestDataGenerator.generateUniqueEmail();
    await page.goto(ACCOUNTS_SITE_URL);
    await page.evaluate((email) => {
      sessionStorage.clear();
      sessionStorage.setItem('current-user-email', email);
    }, newUserEmail);
  });

  test(`Redirect to /authenticate/identification from /authenticate/initialization if no email in session storage`, async ({ page }) => {
    await page.goto(ACCOUNTS_SITE_URL);
    await page.evaluate(() => sessionStorage.clear());

    await page.goto(`${ACCOUNTS_SITE_URL}/authenticate/initialization`);
    await page.waitForURL(`${ACCOUNTS_SITE_URL}/authenticate/identification`);
    expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/authenticate/identification`);
  });

  test('should load the initialization page and display main elements', async ({ page }) => {
    const initializationPage = new AuthenticateInitializationPage(page);
    await initializationPage.goto();

    await expect(initializationPage.pageTitle).toBeVisible();
    await expect(initializationPage.firstNameInput).toBeVisible();
    await expect(initializationPage.lastNameInput).toBeVisible();
    await expect(initializationPage.createAccountButton).toBeVisible();
    await expect(initializationPage.createAccountButton).toBeDisabled();
    await expect(initializationPage.emailLink).toBeVisible();
    await expect(initializationPage.emailLink).toContainText(newUserEmail);
  });

  test('should not display error messages on initial load', async ({ page }) => {
    const initializationPage = new AuthenticateInitializationPage(page);
    await initializationPage.goto();

    await expect(initializationPage.mainErrorMessage).not.toBeVisible();
  });

  test.describe('Form Validation', () => {
    let initializationPage: AuthenticateInitializationPage;

    test.beforeEach(async ({ page }) => {
      initializationPage = new AuthenticateInitializationPage(page);
      await initializationPage.goto();
    });

    test('should show required error for First Name when empty', async () => {
      await initializationPage.firstNameInput.focus();
      await initializationPage.firstNameInput.blur();
      await expect(initializationPage.firstNameError).toBeVisible();
      await expect(initializationPage.firstNameError).toContainText('Please enter your first name');
      await expect(initializationPage.createAccountButton).toBeDisabled();
    });

    test('should show max length error for First Name', async () => {
      await initializationPage.fillFirstName('a'.repeat(19));
      await initializationPage.firstNameInput.blur();
      await expect(initializationPage.firstNameError).toBeVisible();
      await expect(initializationPage.firstNameError).toContainText('Maximum length is 18');
      await expect(initializationPage.createAccountButton).toBeDisabled();
    });

    test('should show max length error for Last Name', async () => {
      await initializationPage.fillLastName('b'.repeat(19));
      await initializationPage.lastNameInput.blur();
      await expect(initializationPage.lastNameError).toBeVisible();
      await expect(initializationPage.lastNameError).toContainText('Maximum length is 18');
      await expect(initializationPage.createAccountButton).toBeDisabled();
    });

    test('should enable the button when form is valid', async () => {
      await initializationPage.fillFirstName('John');
      await initializationPage.fillLastName('Doe');
      await initializationPage.firstNameInput.blur();
      await initializationPage.lastNameInput.blur();
      await expect(initializationPage.createAccountButton).not.toBeDisabled();
    });

    test('should enable the button when only required fields are valid', async () => {
      await initializationPage.fillFirstName('John');
      await initializationPage.firstNameInput.blur();
      await expect(initializationPage.createAccountButton).not.toBeDisabled();
    });
  });
});
