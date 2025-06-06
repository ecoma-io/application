import isCI from 'is-ci';
import { defineConfig, devices } from "@playwright/test";
import { join } from 'path';
import { workspaceRoot } from '@nx/devkit';

export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  testDir: join(__dirname, 'src'),
  outputDir: join(workspaceRoot, 'dist', 'playwright', 'report'),
  fullyParallel: isCI ? false : true,
  forbidOnly: isCI,
  retries: isCI ? 2 : undefined,
  workers: isCI ? 2 : undefined,
  expect: {
    timeout: 30 * 1000,
  },
  use: {
    trace: 'on',
    video: 'on',
    bypassCSP: true,
    ignoreHTTPSErrors: true,
    testIdAttribute: 'data-test-id'
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  reporter: [
    [
      'html',
      {
        outputFolder: join(workspaceRoot, 'dist', 'playwright', 'output'),
      },
    ],
  ],
});
