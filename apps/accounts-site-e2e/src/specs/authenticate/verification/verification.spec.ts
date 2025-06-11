import { test, expect } from '@playwright/test';
import { AuthenticateVerificationPage } from '../../../pages/authenticate/verification.page';
import { ACCOUNTS_SITE_URL } from '../../../utils/domains';

test.describe('Verification Page', { tag: ['@accounts-site', '@authentication', '@verification'] }, () => {
  test(`Redirect to /authenticate/identification from /authenticate/verification if no email in session storage`, async ({ page }) => {
    await page.goto(ACCOUNTS_SITE_URL);
    await page.evaluate(() => sessionStorage.clear());

    const verificationPage = new AuthenticateVerificationPage(page);
    await verificationPage.goto();

    await page.waitForURL(`${ACCOUNTS_SITE_URL}/authenticate/identification`);
    expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/authenticate/identification`);
  });

  test(`Redirect to /authenticate/initialization from /authenticate/verification if no first name in session storage`, async ({ page }) => {
    await page.goto(ACCOUNTS_SITE_URL);
    await page.evaluate(() => {
      sessionStorage.clear();
      sessionStorage.setItem('current-user-email', 'test@example.com');
    });

    const verificationPage = new AuthenticateVerificationPage(page);
    await verificationPage.goto();

    await page.waitForURL(`${ACCOUNTS_SITE_URL}/authenticate/initialization`);
    expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/authenticate/initialization`);
  });

  test('should load the verification page and display main elements', async ({ page }) => {
    await page.goto(ACCOUNTS_SITE_URL);
    await page.evaluate(() => {
      sessionStorage.clear();
      sessionStorage.setItem('current-user-email', 'test@example.com');
      sessionStorage.setItem('current-user-first-name', 'Test');
    });

    const verificationPage = new AuthenticateVerificationPage(page);
    await verificationPage.goto();

    await expect(verificationPage.pageTitle).toBeVisible();
    await expect(verificationPage.pageIntro).toBeVisible();
    await expect(verificationPage.emailLink).toBeVisible();
    await expect(verificationPage.otpInput).toBeVisible();
    await expect(verificationPage.verifyButton).toBeVisible();
    await expect(verificationPage.verifyButton).toBeDisabled();
    await expect(verificationPage.resendButton).toBeVisible();

    await expect(verificationPage.mainErrorMessage).not.toBeVisible();
    await expect(verificationPage.otpErrorMessage).not.toBeVisible();
  });

  test('should display user email and name', async ({ page }) => {
    await page.goto(ACCOUNTS_SITE_URL);
    await page.evaluate(() => {
      sessionStorage.clear();
      sessionStorage.setItem('current-user-email', 'test@example.com');
      sessionStorage.setItem('current-user-first-name', 'Test');
      sessionStorage.setItem('current-user-last-name', 'User');
    });

    const verificationPage = new AuthenticateVerificationPage(page);
    await verificationPage.goto();

    await expect(verificationPage.emailLink).toContainText('test@example.com');
    await expect(verificationPage.pageIntro).toContainText('Hi Test User!');

    await page.evaluate(() => {
      sessionStorage.removeItem('current-user-last-name');
    });

    const verificationPageWithoutLastName = new AuthenticateVerificationPage(page);
    await verificationPageWithoutLastName.goto();

    await expect(verificationPageWithoutLastName.pageIntro).toContainText('Hi Test!');
  });

  test.describe('Form Validation', () => {
    let verificationPage: AuthenticateVerificationPage;

    test.beforeEach(async ({ page }) => {
      verificationPage = new AuthenticateVerificationPage(page);
      await page.goto(ACCOUNTS_SITE_URL);
      await page.evaluate(() => {
        sessionStorage.clear();
        sessionStorage.setItem('current-user-email', 'test@example.com');
        sessionStorage.setItem('current-user-first-name', 'Test');
      });
      await verificationPage.goto();
    });

    test('should show required error for OTP when empty', async () => {
      await verificationPage.otpInput.focus();
      await verificationPage.otpInput.blur();
      await expect(verificationPage.otpErrorMessage).toBeVisible();
      await expect(verificationPage.otpErrorMessage).toContainText('Please enter OTP code');
      await expect(verificationPage.verifyButton).toBeDisabled();
    });

    test('should show pattern error for OTP with incorrect length', async () => {
      await verificationPage.fillOTP('123');
      await verificationPage.otpInput.blur();
      await expect(verificationPage.otpErrorMessage).toBeVisible();
      await expect(verificationPage.otpErrorMessage).toContainText('Please enter valid OTP code');
      await expect(verificationPage.verifyButton).toBeDisabled();

      await verificationPage.fillOTP('1234567');
      await verificationPage.otpInput.blur();
      await expect(verificationPage.otpErrorMessage).toBeVisible();
      await expect(verificationPage.otpErrorMessage).toContainText('Please enter valid OTP code');
      await expect(verificationPage.verifyButton).toBeDisabled();
    });

    test('should enable the verify button with valid OTP', async () => {
      await verificationPage.fillOTP('123456');
      await expect(verificationPage.otpErrorMessage).not.toBeVisible();
      await expect(verificationPage.verifyButton).not.toBeDisabled();
    });
  });
});
