import { test, expect } from '@playwright/test';
import mongoose from 'mongoose';
import { DashboardPage } from '../../pages/dashboard/dashboard.page';
import { TestHelpers } from '../../utils/test-helpers';

let iamMongoConnection: mongoose.Connection;

test.beforeAll(async () => {
  iamMongoConnection = await mongoose.createConnection(process.env['MONGODB_URI'] as string, { dbName: 'iam' }).asPromise();
});

test.afterAll(async () => {
  if (iamMongoConnection) {
    await iamMongoConnection.close();
  }
});

test.describe('Dashboard Navigation', () => {
  let dashboard: DashboardPage;

  test.beforeEach(async ({ page }) => {
    await TestHelpers.setupAuth(page, iamMongoConnection);
    dashboard = new DashboardPage(page);
    await dashboard.goto();
  });

  test('should display correct layout structure', async () => {
    await dashboard.verifyLayoutVisible();
  });

  test('should navigate through menu items', async () => {
    // Check profile navigation
    await dashboard.navigateToProfile();
    await dashboard.verifyCurrentUrl('profile');
    await dashboard.verifyNavigationActive('profile');

    // Check sessions navigation
    await dashboard.navigateToSessions();
    await dashboard.verifyCurrentUrl('sessions');
    await dashboard.verifyNavigationActive('sessions');

    // Check settings navigation
    await dashboard.navigateToSettings();
    await dashboard.verifyCurrentUrl('settings');
    await dashboard.verifyNavigationActive('settings');
  });

  test('should display user menu correctly', async () => {
    // Open user menu and verify items
    await dashboard.openUserMenu();
    await expect(dashboard.menuProfile).toBeVisible();
    await expect(dashboard.menuSettings).toBeVisible();
    await expect(dashboard.menuSignOut).toBeVisible();
  });
});
