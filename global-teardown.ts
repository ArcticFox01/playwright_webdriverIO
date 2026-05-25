import { FullConfig } from "@playwright/test";

async function globalTeardown(config: FullConfig) {
  console.log("🛑 Starting global teardown for mobile tests");

  // Clean up resources
  console.log("Cleaning up test resources...");

  console.log("✅ Global teardown complete");
}

export default globalTeardown;
