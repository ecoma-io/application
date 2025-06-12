import { Locator, Page, expect } from '@playwright/test';
import { ACCOUNTS_SITE_URL } from '../../utils/domains';

export class DashboardPage {
  readonly page: Page;

  // Navigation elements
  readonly navProfile: Locator;
  readonly navSessions: Locator;
  readonly navSettings: Locator;

  // Header elements
  readonly userMenuButton: Locator;
  readonly userMenu: Locator;
  readonly menuProfile: Locator;
  readonly menuSettings: Locator;
  readonly menuSignOut: Locator;

  // Breadcrumbs
  readonly breadcrumbs: Locator;
  readonly breadcrumbHome: Locator;
  readonly breadcrumbAccount: Locator;

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

    // Header elements
    this.userMenuButton = page.getByTestId('user-menu-button');
    this.userMenu = page.getByTestId('user-menu');
    this.menuProfile = page.getByTestId('menu-profile');
    this.menuSettings = page.getByTestId('menu-settings');
    this.menuSignOut = page.getByTestId('menu-signout');

    // Breadcrumbs
    this.breadcrumbs = page.getByTestId('breadcrumbs');
    this.breadcrumbHome = page.getByTestId('breadcrumb-home');
    this.breadcrumbAccount = page.getByTestId('breadcrumb-account');

    // Layout elements
    this.header = page.getByTestId('dashboard-header');
    this.sidebar = page.getByTestId('dashboard-sidebar');
    this.mainContent = page.getByTestId('main-content');
  }

  async goto() {
    await this.page.goto(ACCOUNTS_SITE_URL + '/dashboard');
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

  async openUserMenu() {
    await this.userMenuButton.click();
  }

  async goToProfileFromMenu() {
    await this.openUserMenu();
    await this.menuProfile.click();
  }

  async goToSettingsFromMenu() {
    await this.openUserMenu();
    await this.menuSettings.click();
  }

  async signOut() {
    await this.openUserMenu();
    await this.menuSignOut.click();
  }

  async verifyNavigationActive(menuItem: string) {
    await expect(this.page.getByTestId(`nav-${menuItem}`)).toHaveClass(/active/);
  }

  async verifyCurrentUrl(path: string) {
    await expect(this.page).toHaveURL(`${ACCOUNTS_SITE_URL}/dashboard/${path}`);
  }

  async verifyLayoutVisible() {
    await expect(this.header).toBeVisible();
    await expect(this.sidebar).toBeVisible();
    await expect(this.mainContent).toBeVisible();
  }
}
