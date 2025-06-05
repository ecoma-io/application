import { expect, test } from '@playwright/test';
import { ACCOUNTS_SITE_URL } from '../../supports/domains';



test.describe("auth guard", () => {

  test(`Redirect to /auth/login when accessing /dashboard without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/dashboard`);
    await page.waitForURL(`${ACCOUNTS_SITE_URL}/auth/login`)
    expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/auth/login`);
  });

  test(`Redirect to /auth/login when accessing /dashboard/profile without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/dashboard/profile`);
    await page.waitForURL(`${ACCOUNTS_SITE_URL}/auth/login`)
    expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/auth/login`);
  });


  test(`Redirect to /auth/login when accessing /dashboard/sessions without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/dashboard/sessions`);
    await page.waitForURL(`${ACCOUNTS_SITE_URL}/auth/login`)
    expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/auth/login`);
  });

  test(`Redirect to /auth/login when accessing /dashboard/settings without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/dashboard/settings`);
    await page.waitForURL(`${ACCOUNTS_SITE_URL}/auth/login`)
    expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/auth/login`);
  });

});


test.describe("unauth guard", () => {

  test(`Redirect to /dashboard/profile when accessing /auth/login in loged in context`, async ({ page }) => {
    await page.addInitScript(() => { window.localStorage.setItem("token", 'mocked-access-token') });
    await page.goto(`${ACCOUNTS_SITE_URL}/auth/login`);
    await page.waitForURL(`${ACCOUNTS_SITE_URL}/dashboard/profile`)
    expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/dashboard/profile`);
  });

  test(`Redirect to /dashboard/profile when accessing /auth/verify in loged in context`, async ({ page }) => {
    await page.addInitScript(() => { window.localStorage.setItem("token", 'mocked-access-token') });
    await page.goto(`${ACCOUNTS_SITE_URL}/auth/verify`);
    await page.waitForURL(`${ACCOUNTS_SITE_URL}/dashboard/profile`)
    expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/dashboard/profile`);
  });


});



test.describe("default redirect", () => {

  test(`Redirect to /dashboard/profile when accessing /dashboard in loged in context`, async ({ page }) => {
    await page.addInitScript(() => { window.localStorage.setItem("token", 'mocked-access-token') });
    await page.goto(`${ACCOUNTS_SITE_URL}/dashboard`);
    await page.waitForURL(`${ACCOUNTS_SITE_URL}/dashboard/profile`)
    expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/dashboard/profile`);
  });

  test(`Redirect to /auth/login when accessing /auth without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/auth`);
    await page.waitForURL(`${ACCOUNTS_SITE_URL}/auth/login`)
    expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/auth/login`);
  });

  test(`Redirect to /auth/login when accessing /auth/verify when first visit without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/auth/verify`);
    await page.waitForURL(`${ACCOUNTS_SITE_URL}/auth/login`)
    expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/auth/login`);
  });


});



