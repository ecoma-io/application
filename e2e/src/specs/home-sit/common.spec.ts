import { expect, test } from '@playwright/test';
import { HOME_SITE_URL } from '../../supports/domains';

test(`Checking home site run with angular ssr`, async ({ page }) => {
  await page.goto(HOME_SITE_URL);
  const appRootLocator = page.locator('app-root');
  const ngVersion = await appRootLocator.getAttribute('ng-version');
  expect(ngVersion).toBe('19.2.0');
  const ngServerContext = await appRootLocator.getAttribute('ng-server-context');
  expect(ngServerContext).toBe('ssr');
});
