import { expect } from "@playwright/test";
import { SignInPage } from "../../pages/accounts-site/sign-in.page";
import { getSiteUrl } from "../../utils/common";
import { test } from "../../utils/fixture";

test.describe("Sign-in", () => {
  const verifiedUser = {
    email: `john.doe.${Date.now()}@example.com`,
    password: "StrongPassword123@",
  };
  let signInPage: SignInPage;

  test.beforeEach(async ({ page }) => {
    signInPage = new SignInPage(page);
  });

  test("Displays form inputs correctly", async ({ page }) => {
    await page.goto(getSiteUrl("accounts", "/sign-in"));

    // kiểm tra hiển thị các input
    await expect(signInPage.emailInput).toBeVisible();
    await expect(signInPage.passwordInput).toBeVisible();
    await expect(signInPage.submitButton).toBeVisible();

    await expect(signInPage.emailInput).toHaveAttribute("type", "email");
    await expect(signInPage.emailInput).toHaveAttribute(
      "autocomplete",
      "email"
    );

    await expect(signInPage.passwordInput).toHaveAttribute("type", "password");
    await expect(signInPage.passwordInput).toHaveAttribute(
      "autocomplete",
      "password"
    );

    // Đảm bảo không có lỗi hiển thị ban đầu
    expect(await signInPage.isEmailErrorVisible()).toBe(false);
    expect(await signInPage.isPasswordErrorVisible()).toBe(false);
  });

  test.describe("Form validation", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(getSiteUrl("accounts", "/sign-in"));
    });

    test("Shows errors when fields are empty", async () => {
      await signInPage.submitForm();
      expect(await signInPage.isEmailErrorVisible()).toBe(true);
      expect(await signInPage.isPasswordErrorVisible()).toBe(true);
    });

    test("Shows email error when email is invalid", async () => {
      await signInPage.fillEmail("invalid-email");
      await signInPage.submitForm();
      expect(await signInPage.isEmailErrorVisible()).toBe(true);
    });

    test("Shows password error when password is invalid", async () => {
      await signInPage.fillPassword("invalid");
      await signInPage.submitForm();
      expect(await signInPage.isPasswordErrorVisible()).toBe(true);
    });

    test("Does not show errors with valid inputs", async () => {
      await signInPage.fillEmail("valid@email.com");
      await signInPage.fillPassword("ValidPass123");
      await signInPage.submitForm();

      expect(await signInPage.isEmailErrorVisible()).toBe(false);
      expect(await signInPage.isPasswordErrorVisible()).toBe(false);
    });
  });

  test("Allows sign-in with valid credentials", async ({ page, seeder }) => {
    await seeder.createUser({ ...verifiedUser });
    await page.goto(getSiteUrl("accounts", "/sign-in"));

    await test.step("Ensure sign-in flow is active", async () => {
      await expect(page).toHaveURL(
        new RegExp(`^${getSiteUrl("accounts")}/sign-in\\?flow=.+$`)
      );
    });

    await test.step("Enter login credentials", async () => {
      await signInPage.fillEmail(verifiedUser.email);
      await signInPage.fillPassword(verifiedUser.password);
      await signInPage.submitForm();
    });

    await test.step("Verify redirected to dashboard", async () => {
      await expect(page).toHaveURL(new RegExp(`^${getSiteUrl("accounts")}/$`));
    });
  });
});
