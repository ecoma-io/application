import { Locator, Page } from "@playwright/test";

export class SignUpPage {
  public readonly firstNameInput: Locator;
  public readonly lastNameInput: Locator;
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly submitButton: Locator;

  public readonly firstNameError: Locator;
  public readonly lastNameError: Locator;
  public readonly emailError: Locator;
  public readonly passwordError: Locator;

  constructor(page: Page) {
    // Khởi tạo locators
    this.firstNameInput = page.locator('input[formcontrolname="first_name"]');
    this.lastNameInput = page.locator('input[formcontrolname="last_name"]');
    this.emailInput = page.locator('input[formcontrolname="email"]');
    this.passwordInput = page.locator('input[formcontrolname="password"]');
    this.submitButton = page.locator("form button.btn-primary");

    // Lưu locators cho thông báo lỗi
    this.firstNameError = this.firstNameInput
      .locator("../..")
      .locator("nge-form-control-error .text-error");
    this.lastNameError = this.lastNameInput
      .locator("../..")
      .locator("nge-form-control-error .text-error");
    this.emailError = this.emailInput
      .locator("../..")
      .locator("nge-form-control-error .text-error");
    this.passwordError = this.passwordInput
      .locator("../..")
      .locator("nge-form-control-error .text-error");
  }

  async fillFirstName(firstName: string) {
    await this.firstNameInput.fill(firstName);
  }

  async getFirstNameError() {
    return await this.firstNameError.textContent();
  }

  async isFirstNameErrorVisible() {
    return await this.firstNameError.isVisible();
  }

  async fillLastName(lastName: string) {
    await this.lastNameInput.fill(lastName);
  }

  async getLastNameError() {
    return await this.lastNameError.textContent();
  }

  async isLastNameErrorVisible() {
    return await this.lastNameError.isVisible();
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
