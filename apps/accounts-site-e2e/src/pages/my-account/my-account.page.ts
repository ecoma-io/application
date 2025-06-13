import { Locator, Page, expect } from '@playwright/test';
import { ACCOUNTS_SITE_URL } from '../../utils/domains';

export class MyAccountPage {
  readonly page: Page;

  // Navigation elements
  readonly navProfile: Locator;
  readonly navSessions: Locator;
  readonly navSettings: Locator;

  // Layout elements
  readonly header: Locator;
  readonly sidebar: Locator;
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation elements
    this.navProfile = page.getByTestId('nav-profile');
    this.navSessions = page.getByTestId('nav-sessions');
    this.navSettings = page.getByTestId('nav-settings');

    // Layout elements
    this.header = page.getByTestId('header');
    this.sidebar = page.getByTestId('sidebar');
    this.mainContent = page.getByTestId('main-content');
  }

  async goto() {
    await this.page.goto(ACCOUNTS_SITE_URL + '/my-account');
  }

  async navigateToProfile() {
    await this.navProfile.click();
  }

  async navigateToSessions() {
    await this.navSessions.click();
  }

  async navigateToSettings() {
    await this.navSettings.click();
  }

  async verifyNavigationActive(menuItem: string) {
    await expect(this.page.getByTestId(`nav-${menuItem}`)).toHaveClass(/active/);
  }

  async verifyCurrentUrl(path: string) {
    await expect(this.page).toHaveURL(`${ACCOUNTS_SITE_URL}/my-account/${path}`);
  }

  async verifyLayoutVisible() {
    await expect(this.header).toBeVisible();
    await expect(this.sidebar).toBeVisible();
    await expect(this.mainContent).toBeVisible();
  }
}
