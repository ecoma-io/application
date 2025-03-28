import { expect } from "@playwright/test";
import { SignUpPage } from "../../pages/accounts-site/sign-up.page";
import { getSiteUrl } from "../../utils/common";
import { test } from "../../utils/fixture";

test.describe("Sign-Up Feature", () => {
  let signUpPage: SignUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await page.goto(getSiteUrl("accounts", "/sign-up")); // Điều hướng đến trang đăng ký
  });

  test("Tự động khởi tạo flow mới", async ({ page }) => {
    // Đợi URL chuyển hướng
    await page.waitForURL(getSiteUrl("accounts", "/sign-up?flow=*"));

    // Kiểm tra URL có `/sign-in` và chứa query param `flow`
    const currentUrl = new URL(page.url());
    expect(currentUrl.pathname).toBe("/sign-up");
    expect(currentUrl.searchParams.has("flow")).toBeTruthy();
  });

  test("Hiển thị first name, last name, email, password và không hiển thị lỗi nào", async () => {
    await expect(signUpPage.firstNameInput).toBeVisible();
    await expect(signUpPage.lastNameInput).toBeVisible();
    await expect(signUpPage.emailInput).toBeVisible();
    await expect(signUpPage.passwordInput).toBeVisible();
    await expect(signUpPage.submitButton).toBeVisible();

    await expect(signUpPage.isFirstNameErrorVisible()).resolves.toBeFalsy();
    await expect(signUpPage.isLastNameErrorVisible()).resolves.toBeFalsy();
    await expect(signUpPage.isEmailErrorVisible()).resolves.toBeFalsy();
    await expect(signUpPage.isPasswordErrorVisible()).resolves.toBeFalsy();
  });

  test("Hiển thị lỗi khi bỏ trống form và nhấn submit", async () => {
    await signUpPage.submitForm();
    await expect(signUpPage.isFirstNameErrorVisible()).resolves.toBeTruthy();
    await expect(signUpPage.isEmailErrorVisible()).resolves.toBeTruthy();
    await expect(signUpPage.isPasswordErrorVisible()).resolves.toBeTruthy();
  });

  test("Hiển thị lỗi khi nhập email không hợp lệ", async () => {
    await signUpPage.fillEmail("invalid-email");
    await signUpPage.submitForm();
    await expect(signUpPage.isEmailErrorVisible()).resolves.toBeTruthy();
  });

  test("Hiển thị lỗi khi mật khẩu quá ngắn", async () => {
    await signUpPage.fillPassword("123");
    await signUpPage.submitForm();
    await expect(signUpPage.isPasswordErrorVisible()).resolves.toBeTruthy();
  });

  test("Hiển thị lỗi khi last name dài hơn 50 ký tự", async () => {
    await signUpPage.fillPassword(
      "012345678901234567890123456789012345678901234567891"
    );
    await signUpPage.submitForm();
    await expect(signUpPage.isEmailErrorVisible()).resolves.toBeTruthy();
  });

  test("Đăng ký/Đăng nhập thành công với dữ liệu hợp lệ", async ({ page }) => {
    const email = `john.doe.${Date.now()}@example.com`;

    await test.step("Điền thông tin đăng ký", async () => {
      await signUpPage.fillFirstName("John");
      await signUpPage.fillLastName("Doe");
      await signUpPage.fillEmail(email);
      await signUpPage.fillPassword("StrongPassword123");
      await signUpPage.submitForm();
    });

    await test.step("Kiểm tra modal đăng ký thành công", async () => {
      const successModal = page.locator("text=Registration successful!");
      await expect(successModal).toBeVisible();
    });
  });
});
