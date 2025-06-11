import { MaildevClient } from '@ecoma/test-utils';
import { test, expect } from '@playwright/test';
import { AuthenticateIdentificationPage } from './acccounts-site-authenticate.identification.page';
import { AuthenticateInitializationPage } from './acccounts-site-authenticate.initialization.page';
import { AuthenticateVerificationPage } from './accounts-site-authenticate.verification.page';
import { pollUntil } from '@ecoma/common';

import { ACCOUNTS_SITE_URL } from "./domains"
import { TestDataGenerator } from './test-data-generator';
import mongoose from 'mongoose';
import { TestHelpers } from './test-helpers';

function encodeURIComponentFix(input: string) {
  return encodeURIComponent(input).replace('%3A', ':');
}

let iamMongoConnection: mongoose.Connection;
let maildevClient: MaildevClient;



test.beforeAll(async () => {
  // Setup MongoDB connection
  iamMongoConnection = await mongoose.createConnection(process.env['MONGODB_URI'] as string, { dbName: 'iam' }).asPromise();
  // Setup MailDev client
  maildevClient = new MaildevClient('https://mail.fbi.com');

})

test.afterAll(async () => {
  if (iamMongoConnection) {
    await iamMongoConnection.close();
  }
})


test.describe('Authentication Feature', { tag: ['@accounts-site', '@authentication'] }, () => {
  // Te  st case: Kiểm tra chuyển hướng khi truy cập trang dashboard mà chưa đăng nhập
  test(`Redirect to /authenticate/identification when accessing /dashboard without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/dashboard`);
    const redirectUrlExpected = `${ACCOUNTS_SITE_URL}/authenticate/identification?continue=${encodeURIComponentFix(ACCOUNTS_SITE_URL + '/dashboard')}`;
    await page.waitForURL(redirectUrlExpected);
    expect(page.url()).toBe(redirectUrlExpected);
  });

  // Test case: Kiểm tra chuyển hướng khi truy cập trang profile mà chưa đăng nhập
  test(`Redirect to /authenticate/identification when accessing /dashboard/profile without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/dashboard/profile`);
    const redirectUrlExpected = `${ACCOUNTS_SITE_URL}/authenticate/identification?continue=${encodeURIComponentFix(ACCOUNTS_SITE_URL + '/dashboard/profile')}`;
    await page.waitForURL(redirectUrlExpected);
    expect(page.url()).toBe(redirectUrlExpected);
  });

  // Test case: Kiểm tra chuyển hướng khi truy cập trang sessions mà chưa đăng nhập
  test(`Redirect to /authenticate/identification when accessing /dashboard/sessions without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/dashboard/sessions`);
    const redirectUrlExpected = `${ACCOUNTS_SITE_URL}/authenticate/identification?continue=${encodeURIComponentFix(ACCOUNTS_SITE_URL + '/dashboard/sessions')}`;
    await page.waitForURL(redirectUrlExpected);
    expect(page.url()).toBe(redirectUrlExpected);
  });

  // Test case: Kiểm tra chuyển hướng khi truy cập trang settings mà chưa đăng nhập
  test(`Redirect to /authenticate/identification when accessing /dashboard/settings without login`, async ({ page }) => {
    await page.goto(`${ACCOUNTS_SITE_URL}/dashboard/settings`);
    const redirectUrlExpected = `${ACCOUNTS_SITE_URL}/authenticate/identification?continue=${encodeURIComponentFix(ACCOUNTS_SITE_URL + '/dashboard/settings')}`;
    await page.waitForURL(redirectUrlExpected);
    expect(page.url()).toBe(redirectUrlExpected);
  });

  test.describe('Identification Page', { tag: ['@identification'] }, () => {
    // Test case: Tải trang và hiển thị các thành phần chính
    test('should load the identification page and display main elements', async ({ page }) => {
      const identificationPage = new AuthenticateIdentificationPage(page);

      await identificationPage.goto();

      // Kiểm tra các phần tử chính hiển thị trên trang
      await expect(identificationPage.pageTitle).toBeVisible();
      await expect(identificationPage.emailInput).toBeVisible();
      await expect(identificationPage.continueWithEmailButton).toBeVisible();
      await expect(identificationPage.continueWithEmailButton).toBeDisabled(); // Thêm kiểm tra nút bị vô hiệu hóa ban đầu
      await expect(identificationPage.continueWithGoogleButton).toBeVisible();
      await expect(identificationPage.termsOfServiceLink).toBeVisible();
      await expect(identificationPage.privacyPolicyLink).toBeVisible();
    });

    // Test case: Kiểm tra các thông báo lỗi không hiển thị khi tải trang
    test('should not display error messages on initial load', async ({ page }) => {
      const identificationPage = new AuthenticateIdentificationPage(page);

      await identificationPage.goto();

      // Kiểm tra các thông báo lỗi không hiển thị
      await expect(identificationPage.emailErrorMessage).not.toBeVisible();
      await expect(identificationPage.mainErrorMessage).not.toBeVisible();
    });

    // Test case: Kiểm tra form validation với email trống
    test('should show email validation error and keep button disabled when email is empty', async ({ page }) => {
      const identificationPage = new AuthenticateIdentificationPage(page);

      await identificationPage.goto();
      await identificationPage.emailInput.focus(); // Focus vào input để kích hoạt validation khi blur
      await identificationPage.emailInput.blur(); // Blur khỏi input

      await expect(identificationPage.emailErrorMessage).toBeVisible();
      await expect(identificationPage.emailErrorMessage).toContainText('Please enter your email');
      await expect(identificationPage.continueWithEmailButton).toBeDisabled();
    });

    // Test case: Kiểm tra form validation với email không hợp lệ
    test('should show email validation error and keep button disabled with invalid email', async ({ page }) => {
      const identificationPage = new AuthenticateIdentificationPage(page);

      await identificationPage.goto();
      await identificationPage.fillEmail('invalid-email');
      await identificationPage.emailInput.blur();

      await expect(identificationPage.emailErrorMessage).toBeVisible();
      await expect(identificationPage.emailErrorMessage).toContainText('Please enter a valid email');
      await expect(identificationPage.continueWithEmailButton).toBeDisabled();
    });

    // Test case: Kiểm tra form validation với email hợp lệ
    test('should not show email validation error and enable button with valid email', async ({ page }) => {
      const identificationPage = new AuthenticateIdentificationPage(page);

      await identificationPage.goto();
      await identificationPage.fillEmail('test@example.com');

      await expect(identificationPage.emailErrorMessage).not.toBeVisible();
      await expect(identificationPage.continueWithEmailButton).not.toBeDisabled();
    });

    // --- Test cases cho chức năng gửi form email ---
    test.describe('Email Submission', () => {


      test('should navigate to initialization page on new user', async ({ page }) => {
        const newUserEmail = TestDataGenerator.generateUniqueEmail();
        const identificationPage = new AuthenticateIdentificationPage(page);

        await identificationPage.goto();
        await identificationPage.fillEmail(newUserEmail);
        await identificationPage.clickContinueWithEmail();

        // Check if navigating to the correct page
        await page.waitForURL(ACCOUNTS_SITE_URL + '/authenticate/initialization');
        expect(page.url()).toBe(ACCOUNTS_SITE_URL + '/authenticate/initialization');

        // Optionally check session storage if needed
        const storedEmail = await page.evaluate(() => sessionStorage.getItem('current-user-email'));
        expect(storedEmail).toBe(newUserEmail);
      });

      test('should navigate to verification page on old user', async ({ page }) => {
        const oldUser = TestDataGenerator.generateUserData();
        TestHelpers.createUser(iamMongoConnection, oldUser);

        const identificationPage = new AuthenticateIdentificationPage(page);

        await identificationPage.goto();
        await identificationPage.fillEmail(oldUser.email);
        await identificationPage.clickContinueWithEmail();

        // Check if navigating to the correct page
        await page.waitForURL(ACCOUNTS_SITE_URL + '/authenticate/verification');
        expect(page.url()).toBe(ACCOUNTS_SITE_URL + '/authenticate/verification');

        // Optionally check session storage if needed
        const storedEmail = await page.evaluate(() => sessionStorage.getItem('current-user-email'));
        expect(storedEmail).toBe(oldUser.email);

        const storedFirstName = await page.evaluate(() => sessionStorage.getItem('current-user-first-name'));
        expect(storedFirstName).toBe(oldUser.firstName);
      });

    });

    // Test case: Navigate from Identification to Initialization with continue parameter
    test('should navigate to initialization page with continue parameter on new user', async ({ page }) => {
      const identificationPage = new AuthenticateIdentificationPage(page);
      const newUserEmail = TestDataGenerator.generateUniqueEmail();
      const continueToUrl = 'https://google.com'; // Full URL

      await identificationPage.gotoWithContinue(continueToUrl);
      await identificationPage.fillEmail(newUserEmail);
      await identificationPage.clickContinueWithEmail();

      // Check if navigating to the initialization page and continue parameter is preserved
      const expectedUrl = `${ACCOUNTS_SITE_URL}/authenticate/initialization?continue=${encodeURIComponentFix(continueToUrl)}`;
      await page.waitForURL(expectedUrl);
      expect(page.url()).toBe(expectedUrl);

      const storedEmail = await page.evaluate(() => sessionStorage.getItem('current-user-email'));
      expect(storedEmail).toBe(newUserEmail);
    });

    // New test case: Navigate from Identification to Verification with continue parameter
    test('should navigate to verification page with continue parameter on old user', async ({ page }) => {
      const oldUser = TestDataGenerator.generateUserData();
      TestHelpers.createUser(iamMongoConnection, oldUser);
      const continueToUrl = 'https://google.com'; // Full URL


      const identificationPage = new AuthenticateIdentificationPage(page);


      await identificationPage.gotoWithContinue(continueToUrl);
      await identificationPage.fillEmail(oldUser.email);
      await identificationPage.clickContinueWithEmail();

      // Check if navigating to the verification page and continue parameter is preserved
      const expectedUrl = `${ACCOUNTS_SITE_URL}/authenticate/verification?continue=${encodeURIComponentFix(continueToUrl)}`;
      await page.waitForURL(expectedUrl);
      expect(page.url()).toBe(expectedUrl);

      const storedEmail = await page.evaluate(() => sessionStorage.getItem('current-user-email'));
      expect(storedEmail).toBe(oldUser.email);
      const storedFirstName = await page.evaluate(() => sessionStorage.getItem('current-user-first-name'));
      expect(storedFirstName).toBe(oldUser.firstName);
    });

  });

  test.describe('Initialization Page', { tag: ['@initialization'] }, () => {

    let newUserEmail: string;

    // Before each test in this describe block, set the session storage to simulate being authenticated at the identification step
    test.beforeEach(async ({ page }) => {
      newUserEmail = TestDataGenerator.generateUniqueEmail();
      await page.goto(ACCOUNTS_SITE_URL);
      await page.evaluate((email) => {
        sessionStorage.clear();
        sessionStorage.setItem('current-user-email', email);
      }, newUserEmail);
    });


    // New test case: Redirect from /authenticate/initialization if no email in session storage
    test(`Redirect to /authenticate/identification from /authenticate/initialization if no email in session storage`, async ({ page }) => {
      // Ensure session storage is empty for this test
      await page.goto(ACCOUNTS_SITE_URL);
      await page.evaluate(() => sessionStorage.clear());

      await page.goto(`${ACCOUNTS_SITE_URL}/authenticate/initialization`);
      await page.waitForURL(`${ACCOUNTS_SITE_URL}/authenticate/identification`);
      expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/authenticate/identification`);
    });

    // Before each test in this describe block, set the session storage to simulate being authenticated at the identification step


    // Test case: Load the initialization page and display main elements
    test('should load the initialization page and display main elements', async ({ page }) => {
      const initializationPage = new AuthenticateInitializationPage(page);
      await initializationPage.goto();

      // Check if main elements are visible
      await expect(initializationPage.pageTitle).toBeVisible();
      await expect(initializationPage.firstNameInput).toBeVisible();
      await expect(initializationPage.lastNameInput).toBeVisible();
      await expect(initializationPage.createAccountButton).toBeVisible();
      await expect(initializationPage.createAccountButton).toBeDisabled(); // Button should be disabled initially
      await expect(initializationPage.emailLink).toBeVisible();
      await expect(initializationPage.emailLink).toContainText(newUserEmail);
    });

    // Test case: Should not display error messages on initial load
    test('should not display error messages on initial load', async ({ page }) => {
      const initializationPage = new AuthenticateInitializationPage(page);
      await initializationPage.goto();

      // Check error messages are not visible
      await expect(initializationPage.mainErrorMessage).not.toBeVisible();
      // Assuming FormError component handles specific input errors, we don't check them directly here unless they are part of the main error area.
    });

    test.describe('Form Validation', () => {

      let initializationPage: AuthenticateInitializationPage;

      test.beforeEach(async ({ page }) => {
        initializationPage = new AuthenticateInitializationPage(page);
        await initializationPage.goto();
      });

      // Test case: Show required error for First Name when empty
      test('should show required error for First Name when empty', async () => {
        await initializationPage.firstNameInput.focus();
        await initializationPage.firstNameInput.blur();
        await expect(initializationPage.firstNameError).toBeVisible();
        await expect(initializationPage.firstNameError).toContainText('Please enter your first name');
        await expect(initializationPage.createAccountButton).toBeDisabled();
      });

      // Test case: Show max length error for First Name
      test('should show max length error for First Name', async () => {
        await initializationPage.fillFirstName('a'.repeat(19)); // 19 characters
        await initializationPage.firstNameInput.blur();
        await expect(initializationPage.firstNameError).toBeVisible();
        await expect(initializationPage.firstNameError).toContainText('Maximum length is 18');
        await expect(initializationPage.createAccountButton).toBeDisabled();
      });

      // Test case: Show max length error for Last Name
      test('should show max length error for Last Name', async () => {
        await initializationPage.fillLastName('b'.repeat(19)); // 19 characters
        await initializationPage.lastNameInput.blur();
        await expect(initializationPage.lastNameError).toBeVisible();
        await expect(initializationPage.lastNameError).toContainText('Maximum length is 18');
        await initializationPage.fillFirstName('Valid'); // Fill valid first name to isolate last name validation
        await initializationPage.lastNameInput.focus();
        await initializationPage.fillLastName('b'.repeat(19));
        await initializationPage.lastNameInput.blur();
        await expect(initializationPage.lastNameError).toBeVisible();
        await expect(initializationPage.lastNameError).toContainText('Maximum length is 18');
        await expect(initializationPage.createAccountButton).toBeDisabled();
      });

      // Test case: Button enabled when form is valid
      test('should enable the button when form is valid', async () => {
        await initializationPage.fillFirstName('John');
        await initializationPage.fillLastName('Doe');
        // Blur inputs to ensure validation runs
        await initializationPage.firstNameInput.blur();
        await initializationPage.lastNameInput.blur();
        await expect(initializationPage.createAccountButton).not.toBeDisabled();
      });

      // Test case: Button enabled when only required fields are valid
      test('should enable the button when only required fields are valid', async () => {
        await initializationPage.fillFirstName('John');
        await initializationPage.firstNameInput.blur();
        await expect(initializationPage.createAccountButton).not.toBeDisabled();
      });

    });

    test.describe('Form Submission', () => {
      let initializationPage: AuthenticateInitializationPage;

      test.beforeEach(async ({ page }) => {
        initializationPage = new AuthenticateInitializationPage(page);
        // Set session storage and navigate with continue parameter
        const continueToUrl = 'https://example.com/app/profile-setup'; // Full URL
        await page.goto(ACCOUNTS_SITE_URL); // Go to a base page to clear storage reliably
        await initializationPage.gotoWithContinue(continueToUrl);
      });

      // Test case: Submit with valid First Name and Last Name and preserve continue parameter
      test('should save first and last name, navigate to verification with continue on valid submit', async ({ page }) => {
        const firstName = 'Test';
        const lastName = 'User';
        const continueToUrl = 'https://example.com/app/profile-setup'; // Full URL, must match beforeEach

        await initializationPage.fillFirstName(firstName);
        await initializationPage.fillLastName(lastName);

        await initializationPage.clickCreateAccount();

        // Check session storage
        const storedFirstName = await page.evaluate(() => sessionStorage.getItem('current-user-first-name'));
        expect(storedFirstName).toBe(firstName);
        const storedLastName = await page.evaluate(() => sessionStorage.getItem('current-user-last-name'));
        expect(storedLastName).toBe(lastName);

        // Check navigation and that continue parameter is preserved
        const expectedUrl = `${ACCOUNTS_SITE_URL}/authenticate/verification?continue=${encodeURIComponentFix(continueToUrl)}`;
        await page.waitForURL(expectedUrl);
        expect(page.url()).toBe(expectedUrl);
      });

      // Test case: Submit with only valid First Name and preserve continue parameter
      test('should save only first name, navigate to verification with continue on valid submit (without last name)', async ({ page }) => {
        const firstName = 'Test';
        const continueToUrl = 'https://example.com/app/profile-setup'; // Full URL, must match beforeEach

        await initializationPage.fillFirstName(firstName);

        await initializationPage.clickCreateAccount();

        // Check session storage
        const storedFirstName = await page.evaluate(() => sessionStorage.getItem('current-user-first-name'));
        expect(storedFirstName).toBe(firstName);
        const storedLastName = await page.evaluate(() => sessionStorage.getItem('current-user-last-name'));
        expect(storedLastName).toBe(null); // Ensure last name is not stored or is removed

        // Check navigation and that continue parameter is preserved
        const expectedUrl = `${ACCOUNTS_SITE_URL}/authenticate/verification?continue=${encodeURIComponentFix(continueToUrl)}`;
        await page.waitForURL(expectedUrl);
        expect(page.url()).toBe(expectedUrl);
      });

    });

  });

  test.describe('Verification Page', { tag: ['@verification'] }, () => {



    // Test case: Redirect to /authenticate/identification if no email in session storage
    test(`Redirect to /authenticate/identification from /authenticate/verification if no email in session storage`, async ({ page }) => {
      // Ensure session storage is empty for this test
      await page.goto(ACCOUNTS_SITE_URL); // Go to a base page to clear storage reliably
      await page.evaluate(() => sessionStorage.clear());

      const verificationPage = new AuthenticateVerificationPage(page);
      await verificationPage.goto();

      await page.waitForURL(`${ACCOUNTS_SITE_URL}/authenticate/identification`);
      expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/authenticate/identification`);
    });

    // Test case: Redirect to /authenticate/initialization if no first name in session storage (but email is present)
    test(`Redirect to /authenticate/initialization from /authenticate/verification if no first name in session storage`, async ({ page }) => {
      // Set only email in session storage
      await page.goto(ACCOUNTS_SITE_URL); // Go to a base page first
      await page.evaluate(() => {
        sessionStorage.clear(); // Clear to be sure
        sessionStorage.setItem('current-user-email', 'test@example.com');
      });

      const verificationPage = new AuthenticateVerificationPage(page);
      await verificationPage.goto();

      await page.waitForURL(`${ACCOUNTS_SITE_URL}/authenticate/initialization`);
      expect(page.url()).toBe(`${ACCOUNTS_SITE_URL}/authenticate/initialization`);
    });

    // Test case: Load the verification page and display main elements
    test('should load the verification page and display main elements', async ({ page }) => {

      await page.goto(ACCOUNTS_SITE_URL);
      await page.evaluate(() => {
        sessionStorage.clear(); // Clear to be sure
        sessionStorage.setItem('current-user-email', 'test@example.com');
        sessionStorage.setItem('current-user-first-name', 'Test');
      });

      // beforeEach sets up session storage
      const verificationPage = new AuthenticateVerificationPage(page);
      await verificationPage.goto();


      await expect(verificationPage.pageTitle).toBeVisible();
      await expect(verificationPage.pageIntro).toBeVisible();
      await expect(verificationPage.emailLink).toBeVisible();
      await expect(verificationPage.otpInput).toBeVisible();
      await expect(verificationPage.verifyButton).toBeVisible();
      await expect(verificationPage.verifyButton).toBeDisabled(); // OTP is empty initially
      await expect(verificationPage.resendButton).toBeVisible();

      // Error messages should not be visible initially
      await expect(verificationPage.mainErrorMessage).not.toBeVisible();
      await expect(verificationPage.otpErrorMessage).not.toBeVisible();
    });

    // Test case: Display user information correctly
    test('should display user email and name', async ({ page }) => {
      await page.goto(ACCOUNTS_SITE_URL);
      await page.evaluate(() => {
        sessionStorage.clear(); // Clear to be sure
        sessionStorage.setItem('current-user-email', 'test@example.com');
        sessionStorage.setItem('current-user-first-name', 'Test');
        sessionStorage.setItem('current-user-last-name', 'User');
      });

      const verificationPage = new AuthenticateVerificationPage(page);
      await verificationPage.goto();

      await expect(verificationPage.emailLink).toContainText('test@example.com');
      await expect(verificationPage.pageIntro).toContainText('Hi Test User!'); // Checks for both first and last name

      // Test without last name
      await page.evaluate(() => {
        sessionStorage.removeItem('current-user-last-name');
      });

      const verificationPageWithoutLastName = new AuthenticateVerificationPage(page);
      await verificationPageWithoutLastName.goto();

      await expect(verificationPageWithoutLastName.pageIntro).toContainText('Hi Test!'); // Checks for first name only
    });

    test.describe('Form Validation', () => {

      let verificationPage: AuthenticateVerificationPage;

      test.beforeEach(async ({ page }) => {
        verificationPage = new AuthenticateVerificationPage(page);
        await page.goto(ACCOUNTS_SITE_URL); // Go to a base page
        await page.evaluate(() => {
          sessionStorage.clear();
          sessionStorage.setItem('current-user-email', 'test@example.com');
          sessionStorage.setItem('current-user-first-name', 'Test');
        });
        await verificationPage.goto();
      });

      // Test case: Show required error for OTP when empty
      test('should show required error for OTP when empty', async () => {
        await verificationPage.otpInput.focus();
        await verificationPage.otpInput.blur();
        await expect(verificationPage.otpErrorMessage).toBeVisible();
        await expect(verificationPage.otpErrorMessage).toContainText('Please enter OTP code');
        await expect(verificationPage.verifyButton).toBeDisabled();
      });

      // Test case: Show pattern error for OTP with incorrect length
      test('should show pattern error for OTP with incorrect length', async () => {
        await verificationPage.fillOTP('123'); // Too short
        await verificationPage.otpInput.blur();
        await expect(verificationPage.otpErrorMessage).toBeVisible();
        await expect(verificationPage.otpErrorMessage).toContainText('Please enter valid OTP code');
        await expect(verificationPage.verifyButton).toBeDisabled();

        await verificationPage.fillOTP('1234567'); // Too long
        await verificationPage.otpInput.blur();
        await expect(verificationPage.otpErrorMessage).toBeVisible();
        await expect(verificationPage.otpErrorMessage).toContainText('Please enter valid OTP code');
        await expect(verificationPage.verifyButton).toBeDisabled();
      });

      // Test case: Button enabled with valid OTP
      test('should enable the verify button with valid OTP', async () => {
        await verificationPage.fillOTP('123456');
        await expect(verificationPage.otpErrorMessage).not.toBeVisible();
        await expect(verificationPage.verifyButton).not.toBeDisabled();
      });

    });

    test.describe('Resend OTP Functionality', () => {

      test('should start timer and disable button after clicking resend', async ({ page }) => {
        await page.goto(ACCOUNTS_SITE_URL); // Go to a base page
        await page.evaluate(() => {
          sessionStorage.clear();
          sessionStorage.setItem('current-user-email', 'test@example.com');
          sessionStorage.setItem('current-user-first-name', 'Test');
        });
        const verificationPage = new AuthenticateVerificationPage(page);
        await verificationPage.goto();

        await verificationPage.clickResendOTP();

        // Check button is disabled and timer starts
        await expect(verificationPage.resendButton).toBeDisabled();
        await expect(verificationPage.resendTimer).toBeVisible();
        await expect(verificationPage.resendTimer).toContainText(/\d+s/);

        // Verify email was sent through MailDev
        const email = await pollUntil(
          async () => {
            const emails = await maildevClient.getEmail('test@example.com');
            return emails.length > 0 ? emails[0] : undefined;
          },
          { maxRetries: 10, delayMs: 1000 }
        );
        expect(email).toBeDefined();
        expect(email?.to[0].address).toBe('test@example.com');
      });

      test('should enable button and hide timer after timer finishes', async ({ page }) => {
        await page.goto(ACCOUNTS_SITE_URL); // Go to a base page
        await page.evaluate(() => {
          sessionStorage.clear();
          sessionStorage.setItem('current-user-email', 'test@example.com');
          sessionStorage.setItem('current-user-first-name', 'Test');
        });
        const verificationPage = new AuthenticateVerificationPage(page);
        await verificationPage.goto();

        await verificationPage.clickResendOTP();

        // Wait for the timer duration plus a buffer
        const COLD_DOWN_SECONDS = 10;
        await page.waitForTimeout((COLD_DOWN_SECONDS + 1) * 1000);

        // Check button is enabled and timer is hidden
        await expect(verificationPage.resendButton).not.toBeDisabled();
        await expect(verificationPage.resendTimer).not.toBeVisible();
      });

      test('should reset OTP input on successful resend request', async ({ page }) => {
        const newUserEmail =  TestDataGenerator.generateUniqueEmail();

        await page.goto(ACCOUNTS_SITE_URL); // Go to a base page
        await page.evaluate((email) => {
          sessionStorage.clear();
          sessionStorage.setItem('current-user-email', email);
          sessionStorage.setItem('current-user-first-name', 'Test');
        }, newUserEmail);
        const verificationPage = new AuthenticateVerificationPage(page);
        await verificationPage.goto();

        await verificationPage.fillOTP('999999'); // Fill something first
        await expect(verificationPage.otpInput).toHaveValue('999999');

        await verificationPage.clickResendOTP();

        // Wait for the API response processing
        await expect(verificationPage.otpInput).toHaveValue('');

        // Verify new OTP email was sent
        const email = await pollUntil(
          async () => {
            const emails = await maildevClient.getEmail(newUserEmail);
            return emails.length > 0 ? emails[0] : undefined;
          },
          { maxRetries: 10, delayMs: 1000 }
        );
        expect(email).toBeDefined();
        expect(email?.to[0].address).toBe(newUserEmail);
      });


      // Test case: Verify OTP successfully and navigate to 'continue' URL
      test('should verify OTP successfully and navigate to continue URL', async ({ page }) => {
        const continueToUrl = 'https://example.com/app/protected-page';
        const user = TestDataGenerator.generateUserData();
        await TestHelpers.createUser(iamMongoConnection, user);

        // Set up session storage with user data
        await page.goto(ACCOUNTS_SITE_URL);
        await page.evaluate((userData) => {
          sessionStorage.setItem('current-user-email', userData.email);
          sessionStorage.setItem('current-user-first-name', userData.firstName);
        }, user);


        const verificationPageWithContinue = new AuthenticateVerificationPage(page);
        await verificationPageWithContinue.gotoWithContinue(continueToUrl);
        await verificationPageWithContinue.clickResendOTP();


        // Get OTP from the email
        const email = await pollUntil(
          async () => {
            const emails = await maildevClient.getEmail(user.email);
            return emails.length > 0 ? emails[0] : undefined;
          },
          { maxRetries: 10, delayMs: 1000 }
        );
        expect(email).toBeDefined();
        const otp = email?.text.match(/\d{6}/)?.[0];
        expect(otp).toBeDefined();

        // Fill the OTP
        await verificationPageWithContinue.fillOTP(otp!);
        await verificationPageWithContinue.clickVerify();

        // Wait for navigation to continue URL
        await page.waitForURL(continueToUrl, { timeout: 15000 });

        // Verify navigation
        expect(page.url()).toBe(continueToUrl);

        // Verify session storage is cleared
        const authEmailAfterVerification = await page.evaluate(() => sessionStorage.getItem('current-user-email'));
        expect(authEmailAfterVerification).toBeNull();
        const storedFirstName = await page.evaluate(() => sessionStorage.getItem('current-user-first-name'));
        expect(storedFirstName).toBeNull();
      });

      // Test case: Verify OTP successfully and navigate to dashboard
      test('should verify OTP successfully and navigate to dashboard when no continue parameter', async ({ page }) => {
        const user = TestDataGenerator.generateUserData();
        await TestHelpers.createUser(iamMongoConnection, user);

        // Set up session storage with user data
        await page.goto(ACCOUNTS_SITE_URL);
        await page.evaluate((userData) => {
          sessionStorage.setItem('current-user-email', userData.email);
          sessionStorage.setItem('current-user-first-name', userData.firstName);
        }, user);

        const verificationPageWithoutContinue = new AuthenticateVerificationPage(page);
        await verificationPageWithoutContinue.goto();

        await verificationPageWithoutContinue.clickResendOTP();

        // Get OTP from the email
        const email = await pollUntil(
          async () => {
            const emails = await maildevClient.getEmail(user.email);
            return emails.length > 0 ? emails[0] : undefined;
          },
          { maxRetries: 10, delayMs: 1000 }
        );
        expect(email).toBeDefined();
        const otp = email?.text.match(/\d{6}/)?.[0];
        expect(otp).toBeDefined();

        // Fill the OTP
        await verificationPageWithoutContinue.fillOTP(otp!);
        await verificationPageWithoutContinue.clickVerify();

        // Wait for navigation to dashboard
        await page.waitForURL(ACCOUNTS_SITE_URL + '/dashboard/profile');

        // Verify navigation
        expect(page.url()).toBe(ACCOUNTS_SITE_URL + '/dashboard/profile');

        // Verify session storage is cleared
        const authEmailAfterVerification = await page.evaluate(() => sessionStorage.getItem('current-user-email'));
        expect(authEmailAfterVerification).toBeNull();
        const storedFirstName = await page.evaluate(() => sessionStorage.getItem('current-user-first-name'));
        expect(storedFirstName).toBeNull();
      });

    });
  });
});