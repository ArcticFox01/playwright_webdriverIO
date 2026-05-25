import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  // Test organization
  fullyParallel: false, // Mobile tests typically run sequentially
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Retries for flaky mobile tests
  workers: 1, // Mobile tests: 1 worker at a time

  // Timeout settings
  timeout: 60000, // 60 seconds per test
  expect: {
    timeout: 15000, // 15 seconds for assertions
  },

  // Output configuration
  outputDir: "test-results",
  reporter: [
    [
      "html",
      {
        open: "never",
        outputFolder: "playwright-report",
      },
    ],
    [
      "list",
      {
        printSteps: true,
        printTime: true,
      },
    ],
    [
      "json",
      {
        outputFile: "test-results/results.json",
      },
    ],
    [
      "junit",
      {
        outputFile: "test-results/junit.xml",
      },
    ],
  ],

  // Global test configuration
  use: {
    // Trace configuration
    // trace: "retain-on-failure",

    // Screenshot configuration
    screenshot: {
      mode: "only-on-failure",
      fullPage: false,
    },

    // Video configuration
    // video: {
    //   mode: "retain-on-failure",
    //   size: { width: 1280, height: 720 },
    // },

    // Action timeout
    actionTimeout: 15000,

    // Navigation timeout
    navigationTimeout: 30000,

    // Collect trace information
    launchOptions: {
      slowMo: 1000, // Slow down for debugging
    },
  },

  // Test projects
  projects: [
    {
      name: "ios-mobile",
      use: {
        // Mobile-specific configuration
      },
    },
  ],

  // Global setup
  globalSetup: require.resolve("./global-setup.ts"),

  // Global teardown
  globalTeardown: require.resolve("./global-teardown.ts"),
});
