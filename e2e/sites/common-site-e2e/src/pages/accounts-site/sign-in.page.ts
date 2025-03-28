import { Locator, Page } from "@playwright/test";

export class SignInPage {
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly submitButton: Locator;

  public readonly emailError: Locator;
  public readonly passwordError: Locator;

  constructor(page: Page) {
    // Khởi tạo locators
    this.emailInput = page.locator('input[formcontrolname="email"]');
    this.passwordInput = page.locator('input[formcontrolname="password"]');
    this.submitButton = page.locator("form button.btn-primary");

    // Lưu locators cho thông báo lỗi
    this.emailError = this.emailInput
      .locator("../..")
      .locator("nge-form-control-error .text-error");
    this.passwordError = this.passwordInput
      .locator("../..")
      .locator("nge-form-control-error .text-error");
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async getEmailError() {
    return await this.emailError.textContent();
  }

  async isEmailErrorVisible() {
    return await this.emailError.isVisible();
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async getPasswordError() {
    return await this.passwordError.textContent();
  }

  async isPasswordErrorVisible() {
    return await this.passwordError.isVisible();
  }

  async submitForm() {
    await this.submitButton.click();
  }
}
