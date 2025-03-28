import { expect } from "@playwright/test";
import { SignUpPage } from "../../pages/accounts-site/sign-up.page";
import { extractConfirmationLink, getSiteUrl } from "../../utils/common";
import { test } from "../../utils/fixture";

test.describe("Sign-up", () => {
  const registerUser = {
    firstName: "John",
    lastName: "Doe",
    email: `john.doe.${Date.now()}@example.com`,
    password: "StrongPassword123@",
  };
  let signUpPage: SignUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
  });

  test("Displays form inputs correctly", async ({ page }) => {
    await page.goto(getSiteUrl("accounts", "/sign-up"));

    // kiểm tra hiển thị các input
    await expect(signUpPage.firstNameInput).toBeVisible();
    await expect(signUpPage.lastNameInput).toBeVisible();
    await expect(signUpPage.emailInput).toBeVisible();
    await expect(signUpPage.passwordInput).toBeVisible();
    await expect(signUpPage.submitButton).toBeVisible();

    await expect(signUpPage.emailInput).toHaveAttribute("type", "email");
    await expect(signUpPage.emailInput).toHaveAttribute(
      "autocomplete",
      "email"
    );
    await expect(signUpPage.passwordInput).toHaveAttribute("type", "password");
    await expect(signUpPage.passwordInput).toHaveAttribute(
      "autocomplete",
      "new-password"
    );

    await expect(signUpPage.isFirstNameErrorVisible()).resolves.toBeFalsy();
    await expect(signUpPage.isLastNameErrorVisible()).resolves.toBeFalsy();
    await expect(signUpPage.isEmailErrorVisible()).resolves.toBeFalsy();
    await expect(signUpPage.isPasswordErrorVisible()).resolves.toBeFalsy();
  });

  test.describe("Form validation", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(getSiteUrl("accounts", "/sign-up"));
    });

    test("Shows errors when fields are empty", async () => {
      await signUpPage.submitForm();
      await expect(signUpPage.isFirstNameErrorVisible()).resolves.toBeTruthy();
      await expect(signUpPage.isEmailErrorVisible()).resolves.toBeTruthy();
      await expect(signUpPage.isPasswordErrorVisible()).resolves.toBeTruthy();
    });

    test("Shows email error when email is invalid", async () => {
      await signUpPage.fillEmail("invalid-email");
      await signUpPage.submitForm();
      expect(await signUpPage.isEmailErrorVisible()).toBe(true);
    });

    test("Shows password error when password is invalid", async () => {
      await signUpPage.fillPassword("invalid");
      await signUpPage.submitForm();
      expect(await signUpPage.isPasswordErrorVisible()).toBe(true);
    });

    test.describe("Shows firstName error when first name is invalid", () => {
      test("first name is empty", async () => {
        await signUpPage.fillPassword("");
        await signUpPage.submitForm();
        expect(await signUpPage.isFirstNameErrorVisible()).toBe(true);
      });

      test("first name longer than 50 characters", async () => {
        await signUpPage.fillFirstName("x".repeat(51));
        await signUpPage.submitForm();
        expect(await signUpPage.isFirstNameErrorVisible()).toBe(true);
      });
    });

    test.describe("Shows firstName error when last name is invalid", () => {
      test("last name longer than 50 characters", async () => {
        await signUpPage.fillLastName("x".repeat(51));
        await signUpPage.submitForm();
        expect(await signUpPage.isLastNameErrorVisible()).toBe(true);
      });
    });

    test("Does not show errors with valid inputs", async () => {
      await signUpPage.fillEmail("valid@email.com");
      await signUpPage.fillPassword("ValidPass123");
      await signUpPage.fillFirstName("John");
      await signUpPage.submitForm();
      expect(await signUpPage.isEmailErrorVisible()).toBe(false);
      expect(await signUpPage.isPasswordErrorVisible()).toBe(false);
      expect(await signUpPage.isFirstNameErrorVisible()).toBe(false);
      expect(await signUpPage.isLastNameErrorVisible()).toBe(false);
    });
  });

  test("Allows sign-up with valid data", async ({ page, mailbox }) => {
    await page.goto(getSiteUrl("accounts", "/sign-up"));

    await test.step("Ensure sign-in flow is active", async () => {
      await expect(page).toHaveURL(
        new RegExp(`^${getSiteUrl("accounts")}/sign-up\\?flow=.+$`)
      );
    });

    await test.step("Enter login credentials", async () => {
      await signUpPage.fillFirstName(registerUser.firstName);
      await signUpPage.fillLastName(registerUser.lastName);
      await signUpPage.fillEmail(registerUser.email);
      await signUpPage.fillPassword(registerUser.password);
      await signUpPage.submitForm();
    });

    await test.step("Kiểm tra modal đăng ký thành công", async () => {
      const successModal = page.locator("text=Registration successful!");
      await expect(successModal).toBeVisible();
    });

    await test.step("Bấm nút trong modal để đi đến trang đăng nhập", async () => {
      const continueButton = page.locator("button", { hasText: "Got it" });
      await continueButton.click();
      await expect(page).toHaveURL(
        new RegExp(`^${getSiteUrl("accounts")}/sign-in\\?flow=.+$`)
      );
    });

    await test.step("Kiểm tra email xác nhận được gửi và truy cập vào activate link", async () => {
      const mail = await mailbox.getEmail(registerUser.email);
      expect(mail.subject).toBe("Please verify your email address");
      const confirmLink = extractConfirmationLink(mail.text);
      expect(confirmLink).not.toBeNull();
      page.goto(confirmLink as string);
    });

    await test.step("Kiểm tra xác thực thành công", async () => {
      const successModal = page.locator("text=Verification successful!");
      await expect(successModal).toBeVisible();
    });

    await test.step("Bấm nút trong modal để đi đến trang đăng nhập", async () => {
      const continueButton = page.locator("button", { hasText: "Sign In" });
      await continueButton.click();
      await expect(page).toHaveURL(
        new RegExp(`^${getSiteUrl("accounts")}/sign-in\\?flow=.+$`)
      );
    });

    // await test.step("Điền thông tin đăng nhập", async () => {
    //   await signInPage.fillEmail(email);
    //   await signInPage.fillPassword(password);
    //   await signInPage.submitForm();
    // });

    // await test.step("Có thể truy cập được profile", async () => {
    //   await expect(page).toHaveURL(new RegExp(`^${getSiteUrl("accounts")}/$`));
    // });
  });
});
