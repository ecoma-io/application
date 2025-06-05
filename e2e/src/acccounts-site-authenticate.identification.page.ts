import { Locator, Page } from '@playwright/test';
import { ACCOUNTS_SITE_URL } from './domains';

export class AuthenticateIdentificationPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly emailInput: Locator;
  readonly emailErrorMessage: Locator;
  readonly mainErrorMessage: Locator;
  readonly continueWithEmailButton: Locator;
  readonly continueWithEmailButtonSpinner: Locator;
  readonly continueWithGoogleButton: Locator;
  readonly termsOfServiceLink: Locator;
  readonly privacyPolicyLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId('identification-page-title');
    this.emailInput = page.getByTestId('identification-email-input');
    this.emailErrorMessage = page.getByTestId('identification-email-error').locator('div.label-text-alt > span.text-error')
    this.mainErrorMessage = page.getByTestId('identification-main-error-message')
    this.continueWithEmailButton = page.getByTestId('identification-continue-with-email-button');
    this.continueWithEmailButtonSpinner = page.getByTestId('identification-continue-with-email-button-spinner');
    this.continueWithGoogleButton = page.getByTestId('identification-continue-with-google-button');
    this.termsOfServiceLink = page.getByTestId('identification-terms-of-service-link');
    this.privacyPolicyLink = page.getByTestId('identification-privacy-policy-link');
  }

  async goto() {
    await this.page.goto(ACCOUNTS_SITE_URL + '/authenticate/identification');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async clickContinueWithEmail() {
    await this.continueWithEmailButton.click();
  }

  async clickContinueWithGoogle() {
    await this.continueWithGoogleButton.click();
  }
}
