import { TestLogger } from '@ecoma/testing';
import { type FullConfig } from '@playwright/test';
import { execSync } from 'child_process';

async function globalSetup(config: FullConfig) {
  TestLogger.divider("Global setup");
  if (!process.env["BASE_DOMAIN"]) {
    process.env["BASE_DOMAIN"] = "fbi.com";
    TestLogger.log("Deploying local evnrioment and run with base domain:" + process.env["BASE_DOMAIN"]);
    execSync("docker compose up -d --wait --build", { stdio: "inherit" });
  } else {
    TestLogger.log("Skiping deploy local evnrioment and run with base domain:" + process.env["BASE_DOMAIN"]);
  }
  TestLogger.log("Global setup done!");
}

export default globalSetup;
