import { test, expect } from '@playwright/test';
import { ACCOUNTS_SITE_URL } from '../../utils/domains';

function encodeURIComponentFix(input: string) {
  return encodeURIComponent(input).replace('%3A', ':');
}

test.describe('Authentication Redirects', { tag: ['@accounts-site', '@authentication', '@redirects'] }, () => {
  test(`Redirect to /authenticate/identification when accessing /my-account without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/my-account`);
    const redirectUrlExpected = `${ACCOUNTS_SITE_URL}/authenticate/identification?continue=${encodeURIComponentFix(
      ACCOUNTS_SITE_URL + '/my-account'
    )}`;
    await page.waitForURL(redirectUrlExpected);
    expect(page.url()).toBe(redirectUrlExpected);
  });

  test(`Redirect to /authenticate/identification when accessing /my-account/profile without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/my-account/profile`);
    const redirectUrlExpected = `${ACCOUNTS_SITE_URL}/authenticate/identification?continue=${encodeURIComponentFix(
      ACCOUNTS_SITE_URL + '/my-account/profile'
    )}`;
    await page.waitForURL(redirectUrlExpected);
    expect(page.url()).toBe(redirectUrlExpected);
  });

  test(`Redirect to /authenticate/identification when accessing /my-account/sessions without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/my-account/sessions`);
    const redirectUrlExpected = `${ACCOUNTS_SITE_URL}/authenticate/identification?continue=${encodeURIComponentFix(
      ACCOUNTS_SITE_URL + '/my-account/sessions'
    )}`;
    await page.waitForURL(redirectUrlExpected);
    expect(page.url()).toBe(redirectUrlExpected);
  });

  test(`Redirect to /authenticate/identification when accessing /my-account/settings without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/my-account/settings`);
    const redirectUrlExpected = `${ACCOUNTS_SITE_URL}/authenticate/identification?continue=${encodeURIComponentFix(
      ACCOUNTS_SITE_URL + '/my-account/settings'
    )}`;
    await page.waitForURL(redirectUrlExpected);
    expect(page.url()).toBe(redirectUrlExpected);
  });
});
