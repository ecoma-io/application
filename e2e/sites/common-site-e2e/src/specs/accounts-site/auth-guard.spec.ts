import { expect, test } from "@playwright/test";
import { getSiteUrl } from "../../utils/common";

test("should redirect to login if not authenticated", async ({ page }) => {
  await page.goto(getSiteUrl("accounts"));

  // Đợi URL chuyển hướng
  await page.waitForURL(getSiteUrl("accounts", "/sign-in?flow=*"));

  // Kiểm tra URL có `/sign-in` và chứa query param `flow`
  const currentUrl = new URL(page.url());
  expect(currentUrl.pathname).toBe("/sign-in");
  expect(currentUrl.searchParams.has("flow")).toBeTruthy();
});
