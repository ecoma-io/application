import { nxE2EPreset } from "@nx/playwright/preset";
import { defineConfig, devices } from "@playwright/test";
import { execSync } from "child_process";

// For CI, you may want to set BASE_URL to the deployed application.

// Use the base URL set in global.setup.ts
if (!process.env["BASE_DOMAIN"]) {
  execSync("docker compose up -d --wait --build", { stdio: "inherit" });
  process.env["BASE_DOMAIN"] = "fbi.com";
}

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();



/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Reference the global setup file
  ...nxE2EPreset(__filename, { testDir: "./src" }),
  retries: 3,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    bypassCSP: true,
    ignoreHTTPSErrors: true,
    video: 'on-first-retry',
    testIdAttribute: 'data-test-id'
  },
  /* Run your local dev server before starting the tests */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
    // Uncomment for mobile browsers support
    /* {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    }, */

    // Uncomment for branded browsers
    /* {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    } */
  ],
});
