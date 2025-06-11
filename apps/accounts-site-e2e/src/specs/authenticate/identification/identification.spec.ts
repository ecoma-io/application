import { test, expect } from '@playwright/test';
import { AuthenticateIdentificationPage } from '../../../pages/authenticate/identification.page';

test.describe('Identification Page', { tag: ['@accounts-site', '@authentication', '@identification'] }, () => {
  test('should load the identification page and display main elements', async ({ page }) => {
    const identificationPage = new AuthenticateIdentificationPage(page);

    await identificationPage.goto();

    // Kiểm tra các phần tử chính hiển thị trên trang
    await expect(identificationPage.pageTitle).toBeVisible();
    await expect(identificationPage.emailInput).toBeVisible();
    await expect(identificationPage.continueWithEmailButton).toBeVisible();
    await expect(identificationPage.continueWithEmailButton).toBeDisabled();
    await expect(identificationPage.continueWithGoogleButton).toBeVisible();
    await expect(identificationPage.termsOfServiceLink).toBeVisible();
    await expect(identificationPage.privacyPolicyLink).toBeVisible();
  });

  test('should not display error messages on initial load', async ({ page }) => {
    const identificationPage = new AuthenticateIdentificationPage(page);

    await identificationPage.goto();

    // Kiểm tra các thông báo lỗi không hiển thị
    await expect(identificationPage.emailErrorMessage).not.toBeVisible();
    await expect(identificationPage.mainErrorMessage).not.toBeVisible();
  });

  test('should show email validation error and keep button disabled when email is empty', async ({ page }) => {
    const identificationPage = new AuthenticateIdentificationPage(page);

    await identificationPage.goto();
    await identificationPage.emailInput.focus();
    await identificationPage.emailInput.blur();

    await expect(identificationPage.emailErrorMessage).toBeVisible();
    await expect(identificationPage.emailErrorMessage).toContainText('Please enter your email');
    await expect(identificationPage.continueWithEmailButton).toBeDisabled();
  });

  test('should show email validation error and keep button disabled with invalid email', async ({ page }) => {
    const identificationPage = new AuthenticateIdentificationPage(page);

    await identificationPage.goto();
    await identificationPage.fillEmail('invalid-email');
    await identificationPage.emailInput.blur();

    await expect(identificationPage.emailErrorMessage).toBeVisible();
    await expect(identificationPage.emailErrorMessage).toContainText('Please enter a valid email');
    await expect(identificationPage.continueWithEmailButton).toBeDisabled();
  });

  test('should not show email validation error and enable button with valid email', async ({ page }) => {
    const identificationPage = new AuthenticateIdentificationPage(page);

    await identificationPage.goto();
    await identificationPage.fillEmail('test@example.com');

    await expect(identificationPage.emailErrorMessage).not.toBeVisible();
    await expect(identificationPage.continueWithEmailButton).not.toBeDisabled();
  });
});
