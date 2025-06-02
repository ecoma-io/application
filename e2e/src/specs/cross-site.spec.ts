import { expect, test } from '@playwright/test';
import { HOME_SITE_URL, ACCOUNTS_SITE_URL, ADMIN_SITE_URL, APP_SITE_URL } from '../supports/domains';

const sitesToTest = [
  { name: 'Home Site', url: HOME_SITE_URL },
  { name: 'Accounts Site', url: ACCOUNTS_SITE_URL },
  { name: 'Admin Site', url: ADMIN_SITE_URL },
  { name: 'App Site', url: APP_SITE_URL },
];
// Sử dụng vòng lặp for...of thay vì test.each
for (const site of sitesToTest) {
  test(`Checking site "${site.name}" serve via ssr`, async ({ page }) => {
    await page.goto(site.url);

    const ngServerContext = await page.locator('app-root').getAttribute('ng-server-context');

    expect(ngServerContext).toBeDefined();
    expect(ngServerContext).toBe('ssr');
  });
}
