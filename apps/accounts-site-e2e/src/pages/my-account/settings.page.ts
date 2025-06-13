import { Locator, Page, expect } from '@playwright/test';
import { ACCOUNTS_SITE_URL } from '../../utils/domains';

export class SettingsPage {
  readonly page: Page;

  // Settings sections
  readonly accountSettings: Locator;
  readonly notificationSettings: Locator;
  readonly securitySettings: Locator;

  // Account settings elements
  readonly languageSelect: Locator;
  readonly timezoneSelect: Locator;
  readonly languageError: Locator;
  readonly timezoneError: Locator;

  // Notification settings elements
  readonly emailNotificationsToggle: Locator;
  readonly pushNotificationsToggle: Locator;

  // Security settings elements
  readonly enable2faButton: Locator;
  readonly twoFactorCodeInput: Locator;
  readonly confirm2faButton: Locator;

  // Action elements
  readonly saveButton: Locator;
  readonly resetButton: Locator;
  readonly confirmResetButton: Locator;

  // Message elements
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Settings sections
    this.accountSettings = page.getByTestId('account-settings');
    this.notificationSettings = page.getByTestId('notification-settings');
    this.securitySettings = page.getByTestId('security-settings');

    // Account settings elements
    this.languageSelect = page.getByTestId('language-select');
    this.timezoneSelect = page.getByTestId('timezone-select');
    this.languageError = page.getByTestId('language-error');
    this.timezoneError = page.getByTestId('timezone-error');

    // Notification settings elements
    this.emailNotificationsToggle = page.getByTestId('email-notifications-toggle');
    this.pushNotificationsToggle = page.getByTestId('push-notifications-toggle');

    // Security settings elements
    this.enable2faButton = page.getByTestId('enable-2fa-button');
    this.twoFactorCodeInput = page.getByTestId('2fa-code-input');
    this.confirm2faButton = page.getByTestId('confirm-2fa-button');

    // Action elements
    this.saveButton = page.getByTestId('save-settings-button');
    this.resetButton = page.getByTestId('reset-settings-button');
    this.confirmResetButton = page.getByTestId('confirm-reset-button');

    // Message elements
    this.successMessage = page.getByTestId('success-message');
    this.errorMessage = page.getByTestId('error-message');
  }

  async goto() {
    await this.page.goto(ACCOUNTS_SITE_URL + '/my-account/settings');
  }

  async updateAccountSettings(language: string, timezone: string) {
    await this.languageSelect.selectOption(language);
    await this.timezoneSelect.selectOption(timezone);
    await this.saveButton.click();
  }

  async updateNotificationSettings(enableEmail: boolean, enablePush: boolean) {
    if (enableEmail) await this.emailNotificationsToggle.click();
    if (enablePush) await this.pushNotificationsToggle.click();
    await this.saveButton.click();
  }

  async enable2FA(code: string) {
    await this.enable2faButton.click();
    await this.twoFactorCodeInput.fill(code);
    await this.confirm2faButton.click();
  }

  async resetSettings() {
    await this.resetButton.click();
    await this.confirmResetButton.click();
  }

  async verifySettingsSectionsVisible() {
    await expect(this.accountSettings).toBeVisible();
    await expect(this.notificationSettings).toBeVisible();
    await expect(this.securitySettings).toBeVisible();
  }

  async verifyAccountSettings(language: string, timezone: string) {
    await expect(this.languageSelect).toHaveValue(language);
    await expect(this.timezoneSelect).toHaveValue(timezone);
  }

  async verifySuccessMessage() {
    await expect(this.successMessage).toBeVisible();
  }

  async verifyErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
  }

  async verifyValidationErrors() {
    await expect(this.languageError).toBeVisible();
    await expect(this.timezoneError).toBeVisible();
  }

  async verifySettingsReset() {
    await expect(this.languageSelect).toHaveValue('en');
    await expect(this.timezoneSelect).toHaveValue('UTC');
  }
}
