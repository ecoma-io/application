import { expect, test } from '@playwright/test';
import { ACCOUNTS_SITE_URL, BASE_DOMAIN } from '../../supports/domains';

test('Should redirect to login when not loged in', async ({ page }) => {
  await page.goto(ACCOUNTS_SITE_URL + '/dashboard');
  expect(page.url()).toBe(ACCOUNTS_SITE_URL + '/auth/login');
});

test('Should redirect to dashboard when loged in', async ({ browser }) => {
  const context = await browser.newContext();
  context.addCookies([{ name: 'tk', value: 'mock-token', domain: BASE_DOMAIN, path: '/', expires: Date.now() / 1000 + 100000 }]);
  const page = await context.newPage();
  await page.goto(ACCOUNTS_SITE_URL + '/auth/login');
  expect(page.url()).toBe(ACCOUNTS_SITE_URL + '/dashboard');
});
