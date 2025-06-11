import isCI from 'is-ci';
import { defineConfig, devices } from '@playwright/test';
import { join } from 'path';
import { workspaceRoot } from '@nx/devkit';

if (!process.env['BASE_DOMAIN']) {
  process.env['BASE_DOMAIN'] = 'fbi.com';
}

export default defineConfig({
  testDir: join(__dirname, 'src'),
  outputDir: join(workspaceRoot, 'dist', 'playwright', 'report'),
  fullyParallel: isCI ? false : true,
  forbidOnly: isCI,
  retries: isCI ? 1 : undefined,
  workers: isCI ? 2 : undefined,
  expect: {
    timeout: 30 * 1000,
  },
  use: {
    trace: 'on',
    video: 'on',
    bypassCSP: true,
    ignoreHTTPSErrors: true,
    testIdAttribute: 'data-test-id',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
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
