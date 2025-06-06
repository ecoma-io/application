import { TestLogger } from '@ecoma/testing';
import { type FullConfig } from '@playwright/test';
import { execSync } from 'child_process';

async function globalSetup(config: FullConfig) {
  TestLogger.divider("Global setup");
  const baseDomain = process.env["BASE_DOMAIN"];
  if (process.env["BASE_DOMAIN"] === 'fbi.com') {
    TestLogger.log("Deploying local evnrioment and run with base domain:" + baseDomain);
    execSync("docker compose up -d --wait --build", { stdio: "inherit" });
  } else {
    TestLogger.log("Skiping deploy local evnrioment and run with base domain:" + baseDomain);
  }
  TestLogger.log("Global setup done!");
}

export default globalSetup;