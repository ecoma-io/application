import { Page, Locator } from '@playwright/test';
import { ACCOUNTS_SITE_URL } from '../../utils/domains';

export class AuthenticateVerificationPage {
  readonly page: Page;
  readonly url: string;

  // Locators
  readonly pageTitle: Locator;
  readonly pageIntro: Locator;
  readonly emailLink: Locator;
  readonly mainErrorMessage: Locator;
  readonly otpInput: Locator;
  readonly otpErrorMessage: Locator;
  readonly verifyButton: Locator;
  readonly verifySpinner: Locator;
  readonly resendButton: Locator;
  readonly resendTimer: Locator;

  constructor(page: Page, baseUrl: string = ACCOUNTS_SITE_URL) {
    this.page = page;
    this.url = `${baseUrl}/authenticate/verification`;

    // Initialize locators using data-test-id
    this.pageTitle = page.getByTestId('verification-title');
    this.pageIntro = page.getByTestId('verification-intro');
    this.emailLink = page.getByTestId('verification-email-link');
    this.mainErrorMessage = page.getByTestId('verification-main-error');
    this.otpInput = page.getByTestId('verification-otp-input');
    this.otpErrorMessage = page.getByTestId('verification-otp-error');
    this.verifyButton = page.getByTestId('verification-verify-button');
    this.verifySpinner = page.getByTestId('verification-verify-spinner');
    this.resendButton = page.getByTestId('verification-resend-button');
    this.resendTimer = page.getByTestId('verification-resend-timer');
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async gotoWithContinue(continueUrl: string) {
    await this.page.goto(`${this.url}?continue=${encodeURIComponent(continueUrl)}`);
  }

  async fillOTP(otp: string) {
    await this.otpInput.fill(otp);
  }

  async clickVerify() {
    await this.verifyButton.click();
  }

  async clickResendOTP() {
    await this.resendButton.click();
  }

  // You can add more methods as needed for interactions specific to this page
}
