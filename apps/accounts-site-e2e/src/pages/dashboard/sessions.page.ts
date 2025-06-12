import { Locator, Page, expect } from '@playwright/test';
import { ACCOUNTS_SITE_URL } from '../../utils/domains';

export class SessionsPage {
  readonly page: Page;

  // Session list elements
  readonly sessionsSection: Locator;
  readonly currentSession: Locator;
  readonly sessionItems: Locator;
  readonly refreshButton: Locator;

  // Session detail elements
  readonly deviceInfo: Locator;
  readonly ipAddress: Locator;
  readonly lastActive: Locator;
  readonly sessionActiveIndicator: Locator;
  readonly sessionInactiveIndicator: Locator;

  // Action elements
  readonly terminateButtons: Locator;
  readonly confirmTerminateButton: Locator;

  // Message elements
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Session list elements
    this.sessionsSection = page.getByTestId('sessions-section');
    this.currentSession = page.getByTestId('current-session');
    this.sessionItems = page.getByTestId('session-item');
    this.refreshButton = page.getByTestId('refresh-sessions-button');

    // Session detail elements
    this.deviceInfo = page.getByTestId('device-info');
    this.ipAddress = page.getByTestId('ip-address');
    this.lastActive = page.getByTestId('last-active');
    this.sessionActiveIndicator = page.getByTestId('session-active-indicator');
    this.sessionInactiveIndicator = page.getByTestId('session-inactive-indicator');

    // Action elements
    this.terminateButtons = page.getByTestId('terminate-session-button');
    this.confirmTerminateButton = page.getByTestId('confirm-terminate-button');

    // Message elements
    this.successMessage = page.getByTestId('success-message');
    this.errorMessage = page.getByTestId('error-message');
  }

  async goto() {
    await this.page.goto(ACCOUNTS_SITE_URL + '/dashboard/sessions');
  }

  async getSessionCount() {
    return await this.sessionItems.count();
  }

  async terminateSession(index = 0) {
    await this.terminateButtons.nth(index).click();
    await this.confirmTerminateButton.click();
  }

  async refreshSessions() {
    await this.refreshButton.click();
  }

  async verifySessionsListVisible() {
    await expect(this.sessionsSection).toBeVisible();
    await expect(this.currentSession).toBeVisible();
  }

  async verifySessionDetails() {
    await expect(this.deviceInfo).toBeVisible();
    await expect(this.ipAddress).toBeVisible();
    await expect(this.lastActive).toBeVisible();
  }

  async verifySessionTerminated(initialCount: number) {
    const finalCount = await this.getSessionCount();
    expect(finalCount).toBe(initialCount - 1);
  }

  async verifySuccessMessage() {
    await expect(this.successMessage).toBeVisible();
  }

  async verifyErrorMessage() {
    await expect(this.errorMessage).toBeVisible();
  }

  async verifySessionStatus(isActive: boolean) {
    if (isActive) {
      await expect(this.sessionActiveIndicator).toBeVisible();
    } else {
      await expect(this.sessionInactiveIndicator).toBeVisible();
    }
  }
}
