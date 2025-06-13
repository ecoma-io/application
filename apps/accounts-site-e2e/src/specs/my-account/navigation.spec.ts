import { test } from '@playwright/test';
import mongoose from 'mongoose';
import { TestHelpers } from '../../utils/test-helpers';
import { MyAccountPage } from '../../pages/my-account/my-account.page';

let iamMongoConnection: mongoose.Connection;

test.beforeAll(async () => {
  iamMongoConnection = await mongoose.createConnection(process.env['MONGODB_URI'] as string, { dbName: 'iam' }).asPromise();
});

test.afterAll(async () => {
  if (iamMongoConnection) {
    await iamMongoConnection.close();
  }
});

test.describe('My Account Navigation', () => {
  let myAccount: MyAccountPage;

  test.beforeEach(async ({ page }) => {
    await TestHelpers.setupAuth(page, iamMongoConnection);
    myAccount = new MyAccountPage(page);
    await myAccount.goto();
  });

  test('should display correct layout structure', async () => {
    await myAccount.verifyLayoutVisible();
  });

  test('should navigate through menu items', async () => {
    // Check profile navigation
    await myAccount.navigateToProfile();
    await myAccount.verifyCurrentUrl('profile');
    await myAccount.verifyNavigationActive('profile');

    // Check sessions navigation
    await myAccount.navigateToSessions();
    await myAccount.verifyCurrentUrl('sessions');
    await myAccount.verifyNavigationActive('sessions');

    // Check settings navigation
    await myAccount.navigateToSettings();
    await myAccount.verifyCurrentUrl('settings');
    await myAccount.verifyNavigationActive('settings');
  });
});
