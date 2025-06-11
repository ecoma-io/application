import { test, expect } from '@playwright/test';
import { AuthenticateIdentificationPage } from '../../../pages/authenticate/identification.page';
import { ACCOUNTS_SITE_URL } from '../../../utils/domains';
import { TestDataGenerator } from '../../../utils/test-data-generator';
import { TestHelpers } from '../../../utils/test-helpers';
import mongoose from 'mongoose';

let iamMongoConnection: mongoose.Connection;

test.beforeAll(async () => {
  iamMongoConnection = await mongoose.createConnection(process.env['MONGODB_URI'] as string, { dbName: 'iam' }).asPromise();
});

test.afterAll(async () => {
  if (iamMongoConnection) {
    await iamMongoConnection.close();
  }
});

function encodeURIComponentFix(input: string) {
  return encodeURIComponent(input).replace('%3A', ':');
}

test.describe('Identification Form Submission', { tag: ['@accounts-site', '@authentication', '@identification', '@submission'] }, () => {
  test('should navigate to initialization page on new user', async ({ page }) => {
    const newUserEmail = TestDataGenerator.generateUniqueEmail();
    const identificationPage = new AuthenticateIdentificationPage(page);

    await identificationPage.goto();
    await identificationPage.fillEmail(newUserEmail);
    await identificationPage.clickContinueWithEmail();

    await page.waitForURL(ACCOUNTS_SITE_URL + '/authenticate/initialization');
    expect(page.url()).toBe(ACCOUNTS_SITE_URL + '/authenticate/initialization');

    const storedEmail = await page.evaluate(() => sessionStorage.getItem('current-user-email'));
    expect(storedEmail).toBe(newUserEmail);
  });

  test('should navigate to verification page on old user', async ({ page }) => {
    const oldUser = TestDataGenerator.generateUserData();
    TestHelpers.createUser(iamMongoConnection, oldUser);

    const identificationPage = new AuthenticateIdentificationPage(page);

    await identificationPage.goto();
    await identificationPage.fillEmail(oldUser.email);
    await identificationPage.clickContinueWithEmail();

    await page.waitForURL(ACCOUNTS_SITE_URL + '/authenticate/verification');
    expect(page.url()).toBe(ACCOUNTS_SITE_URL + '/authenticate/verification');

    const storedEmail = await page.evaluate(() => sessionStorage.getItem('current-user-email'));
    expect(storedEmail).toBe(oldUser.email);

    const storedFirstName = await page.evaluate(() => sessionStorage.getItem('current-user-first-name'));
    expect(storedFirstName).toBe(oldUser.firstName);
  });

  test('should navigate to initialization page with continue parameter on new user', async ({ page }) => {
    const identificationPage = new AuthenticateIdentificationPage(page);
    const newUserEmail = TestDataGenerator.generateUniqueEmail();
    const continueToUrl = 'https://google.com';

    await identificationPage.gotoWithContinue(continueToUrl);
    await identificationPage.fillEmail(newUserEmail);
    await identificationPage.clickContinueWithEmail();

    const expectedUrl = `${ACCOUNTS_SITE_URL}/authenticate/initialization?continue=${encodeURIComponentFix(continueToUrl)}`;
    await page.waitForURL(expectedUrl);
    expect(page.url()).toBe(expectedUrl);

    const storedEmail = await page.evaluate(() => sessionStorage.getItem('current-user-email'));
    expect(storedEmail).toBe(newUserEmail);
  });

  test('should navigate to verification page with continue parameter on old user', async ({ page }) => {
    const oldUser = TestDataGenerator.generateUserData();
    TestHelpers.createUser(iamMongoConnection, oldUser);
    const continueToUrl = 'https://google.com';

    const identificationPage = new AuthenticateIdentificationPage(page);

    await identificationPage.gotoWithContinue(continueToUrl);
    await identificationPage.fillEmail(oldUser.email);
    await identificationPage.clickContinueWithEmail();

    const expectedUrl = `${ACCOUNTS_SITE_URL}/authenticate/verification?continue=${encodeURIComponentFix(continueToUrl)}`;
    await page.waitForURL(expectedUrl);
    expect(page.url()).toBe(expectedUrl);

    const storedEmail = await page.evaluate(() => sessionStorage.getItem('current-user-email'));
    expect(storedEmail).toBe(oldUser.email);
    const storedFirstName = await page.evaluate(() => sessionStorage.getItem('current-user-first-name'));
    expect(storedFirstName).toBe(oldUser.firstName);
  });
});
