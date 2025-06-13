import { Locator, Page, expect } from '@playwright/test';
import { ACCOUNTS_SITE_URL } from '../../utils/domains';

export class ProfilePage {
  readonly page: Page;

  // Profile section elements
  readonly profileSection: Locator;
  readonly userName: Locator;
  readonly userEmail: Locator;
  readonly userAvatar: Locator;

  // Form elements
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly saveButton: Locator;
  readonly avatarUploadButton: Locator;

  // Message elements
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly nameError: Locator;
  readonly emailError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Profile section elements
    this.profileSection = page.getByTestId('profile-section');
    this.userName = page.getByTestId('user-name');
    this.userEmail = page.getByTestId('user-email');
    this.userAvatar = page.getByTestId('user-avatar');

    // Form elements
    this.nameInput = page.getByTestId('name-input');
    this.emailInput = page.getByTestId('email-input');
    this.saveButton = page.getByTestId('save-profile-button');
    this.avatarUploadButton = page.getByTestId('avatar-upload-button');

    // Message elements
    this.successMessage = page.getByTestId('success-message');
    this.errorMessage = page.getByTestId('error-message');
    this.nameError = page.getByTestId('name-error');
    this.emailError = page.getByTestId('email-error');
  }

  async goto() {
    await this.page.goto(ACCOUNTS_SITE_URL + '/my-account/profile');
  }

  async updateProfile(name: string, email: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.saveButton.click();
  }

  async updateName(name: string) {
    await this.nameInput.fill(name);
    await this.saveButton.click();
  }

  async updateEmail(email: string) {
    await this.emailInput.fill(email);
    await this.saveButton.click();
  }

  async uploadAvatar(filePath: string) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.avatarUploadButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }

  async verifyProfileInfo(name: string, email: string) {
    await expect(this.userName).toHaveText(name);
    await expect(this.userEmail).toHaveText(email);
  }

  async verifySuccessMessage() {
    await expect(this.successMessage).toBeVisible();
  }

  async verifyErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
  }

  async verifyValidationErrors() {
    await expect(this.nameError).toBeVisible();
    await expect(this.emailError).toBeVisible();
  }

  async verifyAvatarUpdated() {
    await expect(this.userAvatar).toBeVisible();
  }
}
