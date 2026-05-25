import { FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  console.log("🚀 Starting global setup for mobile tests");

  // Verify Appium server is running
  const appiumUrl = process.env.APPIUM_HOST + ":" + process.env.APPIUM_PORT;
  console.log(`Appium server: ${appiumUrl}`);

  // Create test results directory
  const fs = require("fs");
  const path = require("path");

  const testResultsDir = path.join(__dirname, "test-results");
  const screenshotsDir = path.join(testResultsDir, "screenshots");
  const videosDir = path.join(testResultsDir, "videos");

  [testResultsDir, screenshotsDir, videosDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });

  console.log("✅ Global setup complete");
}

export default globalSetup;
