import { test, expect } from '@playwright/test';
import { AuthenticateVerificationPage } from '../../../pages/authenticate/verification.page';
import { ACCOUNTS_SITE_URL } from '../../../utils/domains';
import { TestDataGenerator } from '../../../utils/test-data-generator';
import { TestHelpers } from '../../../utils/test-helpers';
import { MaildevClient } from '@ecoma/test-utils';
import { pollUntil } from '@ecoma/common';
import mongoose from 'mongoose';

let iamMongoConnection: mongoose.Connection;
let maildevClient: MaildevClient;

test.beforeAll(async () => {
  iamMongoConnection = await mongoose.createConnection(process.env['MONGODB_URI'] as string, { dbName: 'iam' }).asPromise();
  maildevClient = new MaildevClient('https://mail.fbi.com');
});

test.afterAll(async () => {
  if (iamMongoConnection) {
    await iamMongoConnection.close();
  }
});

test.describe('Verify OTP Functionality', { tag: ['@accounts-site', '@authentication', '@verification', '@verify-otp'] }, () => {
  test('should verify OTP successfully and navigate to continue URL', async ({ page }) => {
    const continueToUrl = 'https://example.com/app/protected-page';
    const user = TestDataGenerator.generateUserData();
    await TestHelpers.createUser(iamMongoConnection, user);

    await page.goto(ACCOUNTS_SITE_URL);
    await page.evaluate((userData) => {
      sessionStorage.setItem('current-user-email', userData.email);
      sessionStorage.setItem('current-user-first-name', userData.firstName);
    }, user);

    const verificationPageWithContinue = new AuthenticateVerificationPage(page);
    await verificationPageWithContinue.gotoWithContinue(continueToUrl);
    await verificationPageWithContinue.clickResendOTP();

    const email = await pollUntil(
      async () => {
        const emails = await maildevClient.getEmail(user.email);
        return emails.length > 0 ? emails[0] : undefined;
      },
      { maxRetries: 10, delayMs: 1000 }
    );
    expect(email).toBeDefined();
    const otp = email?.text.match(/\d{6}/)?.[0];
    expect(otp).toBeDefined();

    await verificationPageWithContinue.fillOTP(otp!);
    await verificationPageWithContinue.clickVerify();

    await page.waitForURL(continueToUrl, { timeout: 15000 });
    expect(page.url()).toBe(continueToUrl);

    const authEmailAfterVerification = await page.evaluate(() => sessionStorage.getItem('current-user-email'));
    expect(authEmailAfterVerification).toBeNull();
    const storedFirstName = await page.evaluate(() => sessionStorage.getItem('current-user-first-name'));
    expect(storedFirstName).toBeNull();
  });

  test('should verify OTP successfully and navigate to dashboard when no continue parameter', async ({ page }) => {
    const user = TestDataGenerator.generateUserData();
    await TestHelpers.createUser(iamMongoConnection, user);

    await page.goto(ACCOUNTS_SITE_URL);
    await page.evaluate((userData) => {
      sessionStorage.setItem('current-user-email', userData.email);
      sessionStorage.setItem('current-user-first-name', userData.firstName);
    }, user);

    const verificationPageWithoutContinue = new AuthenticateVerificationPage(page);
    await verificationPageWithoutContinue.goto();

    await verificationPageWithoutContinue.clickResendOTP();

    const email = await pollUntil(
      async () => {
        const emails = await maildevClient.getEmail(user.email);
        return emails.length > 0 ? emails[0] : undefined;
      },
      { maxRetries: 10, delayMs: 1000 }
    );
    expect(email).toBeDefined();
    const otp = email?.text.match(/\d{6}/)?.[0];
    expect(otp).toBeDefined();

    await verificationPageWithoutContinue.fillOTP(otp!);
    await verificationPageWithoutContinue.clickVerify();

    await page.waitForURL(ACCOUNTS_SITE_URL + '/my-account/profile');
    expect(page.url()).toBe(ACCOUNTS_SITE_URL + '/my-account/profile');

    const authEmailAfterVerification = await page.evaluate(() => sessionStorage.getItem('current-user-email'));
    expect(authEmailAfterVerification).toBeNull();
    const storedFirstName = await page.evaluate(() => sessionStorage.getItem('current-user-first-name'));
    expect(storedFirstName).toBeNull();
  });
});
