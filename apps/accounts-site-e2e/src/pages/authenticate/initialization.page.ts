import { Locator, Page } from '@playwright/test';
import { ACCOUNTS_SITE_URL } from '../../utils/domains';

export class AuthenticateInitializationPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly createAccountButton: Locator;
  readonly mainErrorMessage: Locator;
  readonly emailLink: Locator;
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByTestId('initialization-page-title');
    this.firstNameInput = page.getByTestId('initialization-first-name-input');
    this.lastNameInput = page.getByTestId('initialization-last-name-input');
    this.createAccountButton = page.getByTestId('initialization-create-account-button');
    this.mainErrorMessage = page.getByTestId('initialization-main-error-message');
    this.emailLink = page.getByTestId('initialization-email-link');
    this.firstNameError = page.getByTestId('first-name-error').locator('div.label-text-alt > span.text-error');
    this.lastNameError = page.getByTestId('last-name-error').locator('div.label-text-alt > span.text-error');
  }

  async goto() {
    await this.page.goto(`${ACCOUNTS_SITE_URL}/authenticate/initialization`);
  }

  async gotoWithContinue(continueUrl: string) {
    await this.page.goto(`${ACCOUNTS_SITE_URL}/authenticate/initialization?continue=${encodeURIComponent(continueUrl)}`);
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  async clickCreateAccount() {
    await this.createAccountButton.click();
  }
}
