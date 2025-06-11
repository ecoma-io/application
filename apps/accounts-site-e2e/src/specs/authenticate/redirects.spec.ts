import { test, expect } from '@playwright/test';
import { ACCOUNTS_SITE_URL } from '../../utils/domains';

function encodeURIComponentFix(input: string) {
  return encodeURIComponent(input).replace('%3A', ':');
}

test.describe('Authentication Redirects', { tag: ['@accounts-site', '@authentication', '@redirects'] }, () => {
  test(`Redirect to /authenticate/identification when accessing /dashboard without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/dashboard`);
    const redirectUrlExpected = `${ACCOUNTS_SITE_URL}/authenticate/identification?continue=${encodeURIComponentFix(
      ACCOUNTS_SITE_URL + '/dashboard'
    )}`;
    await page.waitForURL(redirectUrlExpected);
    expect(page.url()).toBe(redirectUrlExpected);
  });

  test(`Redirect to /authenticate/identification when accessing /dashboard/profile without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/dashboard/profile`);
    const redirectUrlExpected = `${ACCOUNTS_SITE_URL}/authenticate/identification?continue=${encodeURIComponentFix(
      ACCOUNTS_SITE_URL + '/dashboard/profile'
    )}`;
    await page.waitForURL(redirectUrlExpected);
    expect(page.url()).toBe(redirectUrlExpected);
  });

  test(`Redirect to /authenticate/identification when accessing /dashboard/sessions without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/dashboard/sessions`);
    const redirectUrlExpected = `${ACCOUNTS_SITE_URL}/authenticate/identification?continue=${encodeURIComponentFix(
      ACCOUNTS_SITE_URL + '/dashboard/sessions'
    )}`;
    await page.waitForURL(redirectUrlExpected);
    expect(page.url()).toBe(redirectUrlExpected);
  });

  test(`Redirect to /authenticate/identification when accessing /dashboard/settings without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/dashboard/settings`);
    const redirectUrlExpected = `${ACCOUNTS_SITE_URL}/authenticate/identification?continue=${encodeURIComponentFix(
      ACCOUNTS_SITE_URL + '/dashboard/settings'
    )}`;
    await page.waitForURL(redirectUrlExpected);
    expect(page.url()).toBe(redirectUrlExpected);
  });
});
