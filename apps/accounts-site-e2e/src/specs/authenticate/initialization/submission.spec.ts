import { test, expect } from '@playwright/test';
import { AuthenticateInitializationPage } from '../../../pages/authenticate/initialization.page';
import { ACCOUNTS_SITE_URL } from '../../../utils/domains';
import { TestDataGenerator } from '../../../utils/test-data-generator';

function encodeURIComponentFix(input: string) {
  return encodeURIComponent(input).replace('%3A', ':');
}

test.describe('Initialization Form Submission', { tag: ['@accounts-site', '@authentication', '@initialization', '@submission'] }, () => {
  let initializationPage: AuthenticateInitializationPage;

  test.beforeEach(async ({ page }) => {
    await page.goto(ACCOUNTS_SITE_URL);
    await page.evaluate((email) => {
      sessionStorage.clear();
      sessionStorage.setItem('current-user-email', email);
    }, TestDataGenerator.generateUniqueEmail());
    const continueToUrl = 'https://example.com/app/profile-setup';
    initializationPage = new AuthenticateInitializationPage(page);
    await initializationPage.gotoWithContinue(continueToUrl);
  });

  test('should save first and last name, navigate to verification with continue on valid submit', async ({ page }) => {
    const firstName = 'Test';
    const lastName = 'User';
    const continueToUrl = 'https://example.com/app/profile-setup';

    await initializationPage.fillFirstName(firstName);
    await initializationPage.fillLastName(lastName);
    await initializationPage.clickCreateAccount();

    const storedFirstName = await page.evaluate(() => sessionStorage.getItem('current-user-first-name'));
    expect(storedFirstName).toBe(firstName);
    const storedLastName = await page.evaluate(() => sessionStorage.getItem('current-user-last-name'));
    expect(storedLastName).toBe(lastName);

    const expectedUrl = `${ACCOUNTS_SITE_URL}/authenticate/verification?continue=${encodeURIComponentFix(continueToUrl)}`;
    await page.waitForURL(expectedUrl);
    expect(page.url()).toBe(expectedUrl);
  });

  test('should save only first name, navigate to verification with continue on valid submit (without last name)', async ({ page }) => {
    const firstName = 'Test';
    const continueToUrl = 'https://example.com/app/profile-setup';

    await initializationPage.fillFirstName(firstName);
    await initializationPage.clickCreateAccount();

    const storedFirstName = await page.evaluate(() => sessionStorage.getItem('current-user-first-name'));
    expect(storedFirstName).toBe(firstName);
    const storedLastName = await page.evaluate(() => sessionStorage.getItem('current-user-last-name'));
    expect(storedLastName).toBe(null);

    const expectedUrl = `${ACCOUNTS_SITE_URL}/authenticate/verification?continue=${encodeURIComponentFix(continueToUrl)}`;
    await page.waitForURL(expectedUrl);
    expect(page.url()).toBe(expectedUrl);
  });
});
