import { expect, test } from '@playwright/test';
import { APP_SITE_URL } from '../../supports/domains';

test(`Checking app site run with angular`, async ({ page }) => {
  await page.goto(APP_SITE_URL);
  const appRootLocator = page.locator('app-root');
  const ngVersion = await appRootLocator.getAttribute('ng-version');
  expect(ngVersion).toBe('19.2.0');
});
