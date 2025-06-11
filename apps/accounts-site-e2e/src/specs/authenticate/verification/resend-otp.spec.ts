import { test, expect } from '@playwright/test';
import { AuthenticateVerificationPage } from '../../../pages/authenticate/verification.page';
import { ACCOUNTS_SITE_URL } from '../../../utils/domains';
import { TestDataGenerator } from '../../../utils/test-data-generator';
import { MaildevClient } from '@ecoma/test-utils';
import { pollUntil } from '@ecoma/common';

let maildevClient: MaildevClient;

test.beforeAll(async () => {
  maildevClient = new MaildevClient('https://mail.fbi.com');
});

test.describe('Resend OTP Functionality', { tag: ['@accounts-site', '@authentication', '@verification', '@resend-otp'] }, () => {
  test('should start timer and disable button after clicking resend', async ({ page }) => {
    await page.goto(ACCOUNTS_SITE_URL);
    await page.evaluate(() => {
      sessionStorage.clear();
      sessionStorage.setItem('current-user-email', 'test@example.com');
      sessionStorage.setItem('current-user-first-name', 'Test');
    });
    const verificationPage = new AuthenticateVerificationPage(page);
    await verificationPage.goto();

    await verificationPage.clickResendOTP();

    await expect(verificationPage.resendButton).toBeDisabled();
    await expect(verificationPage.resendTimer).toBeVisible();
    await expect(verificationPage.resendTimer).toContainText(/\d+s/);

    const email = await pollUntil(
      async () => {
        const emails = await maildevClient.getEmail('test@example.com');
        return emails.length > 0 ? emails[0] : undefined;
      },
      { maxRetries: 10, delayMs: 1000 }
    );
    expect(email).toBeDefined();
    expect(email?.to[0].address).toBe('test@example.com');
  });

  test('should enable button and hide timer after timer finishes', async ({ page }) => {
    await page.goto(ACCOUNTS_SITE_URL);
    await page.evaluate(() => {
      sessionStorage.clear();
      sessionStorage.setItem('current-user-email', 'test@example.com');
      sessionStorage.setItem('current-user-first-name', 'Test');
    });
    const verificationPage = new AuthenticateVerificationPage(page);
    await verificationPage.goto();

    await verificationPage.clickResendOTP();

    const COLD_DOWN_SECONDS = 10;
    await page.waitForTimeout((COLD_DOWN_SECONDS + 1) * 1000);

    await expect(verificationPage.resendButton).not.toBeDisabled();
    await expect(verificationPage.resendTimer).not.toBeVisible();
  });

  test('should reset OTP input on successful resend request', async ({ page }) => {
    const newUserEmail = TestDataGenerator.generateUniqueEmail();

    await page.goto(ACCOUNTS_SITE_URL);
    await page.evaluate((email) => {
      sessionStorage.clear();
      sessionStorage.setItem('current-user-email', email);
      sessionStorage.setItem('current-user-first-name', 'Test');
    }, newUserEmail);
    const verificationPage = new AuthenticateVerificationPage(page);
    await verificationPage.goto();

    await verificationPage.fillOTP('999999');
    await expect(verificationPage.otpInput).toHaveValue('999999');

    await verificationPage.clickResendOTP();

    await expect(verificationPage.otpInput).toHaveValue('');

    const email = await pollUntil(
      async () => {
        const emails = await maildevClient.getEmail(newUserEmail);
        return emails.length > 0 ? emails[0] : undefined;
      },
      { maxRetries: 10, delayMs: 1000 }
    );
    expect(email).toBeDefined();
    expect(email?.to[0].address).toBe(newUserEmail);
  });
});
