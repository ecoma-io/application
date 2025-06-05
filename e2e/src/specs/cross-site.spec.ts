import { expect, test } from '@playwright/test';
import { HOME_SITE_URL } from '../supports/domains';

test(`Checking site home site serve via ssr`, async ({ page }) => {
  await page.goto(HOME_SITE_URL);
  const ngServerContext = await page.locator('app-root').getAttribute('ng-server-context');
  expect(ngServerContext).toBeDefined();
  expect(ngServerContext).toBe('ssr');
});
