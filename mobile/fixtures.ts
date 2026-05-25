import { test as base } from "@playwright/test";
import { MobileDriver } from "./MobileDriver";
import { MobilePage } from "./MobilePage";

// Enhanced fixtures with test metadata support
export const test = base.extend<{
  mobile: MobilePage;
  testEnvironment: {
    platform: string;
    deviceName: string;
    appVersion: string;
  };
}>({
  // Test environment fixture
  testEnvironment: async ({}, use) => {
    const environment = {
      platform: process.env.APPIUM_PLATFORM_NAME || "iOS",
      deviceName: process.env.APPIUM_DEVICE_NAME || "Unknown",
      appVersion: "1.0.0", // Can be extracted from app if needed
    };

    await test.step("🌍 Setting up test environment", async () => {
      console.log("Test Environment:", environment);
    });

    await use(environment);
  },

  // Mobile fixture
  mobile: async ({ testEnvironment }, use) => {
    const mobileDriver = new MobileDriver();

    await test.step("🚀 Starting Appium session", async () => {
      console.log("Initializing Appium connection...");
      console.log("Platform:", testEnvironment.platform);
      console.log("Device:", testEnvironment.deviceName);
    });

    await mobileDriver.start();
    const page = new MobilePage(mobileDriver.driver);

    await test.step("✅ Appium session started successfully", async () => {
      console.log("Session ID:", mobileDriver.driver.sessionId);
    });

    await use(page);

    await test.step("🛑 Stopping Appium session", async () => {
      console.log("Cleaning up Appium connection...");
    });

    await mobileDriver.stop();

    await test.step("✅ Appium session stopped successfully", async () => {
      console.log("Session cleanup complete");
    });
  },
});

export { expect } from "@playwright/test";

// Export test utilities
export const TestUtils = {
  /**
   * Adds delay between steps
   * @param ms - Delay in milliseconds
   */
  delay: async (ms: number) => {
    await test.step(`⏸️ Delay: ${ms}ms`, async () => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    });
  },

  /**
   * Logs custom message
   * @param message - The message to log
   */
  log: (message: string) => {
    console.log(`[TEST LOG] ${message}`);
  },

  /**
   * Captures screenshot with timestamp
   * @param mobile - MobilePage instance
   * @param name - Screenshot name
   */
  captureScreenshot: async (mobile: MobilePage, name: string) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const screenshotName = `${name}_${timestamp}`;
    await mobile.takeScreenshot(screenshotName);
  },

  /**
   * Adds test annotation
   * @param type - Annotation type
   * @param description - Annotation description
   */
  addAnnotation: (type: string, description: string) => {
    test.info().annotations.push({
      type,
      description,
    });
  },

  /**
   * Sets test severity
   * @param severity - Severity level (critical, high, medium, low)
   */
  setSeverity: (severity: string) => {
    TestUtils.addAnnotation("severity", severity);
  },

  /**
   * Adds test case ID
   * @param testCaseId - Test case identifier
   */
  setTestCaseId: (testCaseId: string) => {
    TestUtils.addAnnotation("test case", testCaseId);
  },

  /**
   * Adds test description
   * @param description - Test description
   */
  setDescription: (description: string) => {
    test.info().annotations.push({
      type: "description",
      description,
    });
  },

  /**
   * Retries an operation with exponential backoff
   * @param operation - Operation to retry
   * @param maxRetries - Maximum number of retries
   * @param delayMs - Initial delay in milliseconds
   */
  retryWithBackoff: async <T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    delayMs = 1000,
  ): Promise<T> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        const delay = delayMs * Math.pow(2, attempt - 1);
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error("Max retries exceeded");
  },

  /**
   * Waits for condition with timeout
   * @param condition - Condition function
   * @param timeoutMs - Timeout in milliseconds
   * @param pollingMs - Polling interval in milliseconds
   */
  waitForCondition: async (
    condition: () => Promise<boolean>,
    timeoutMs = 30000,
    pollingMs = 500,
  ): Promise<void> => {
    const startTime = Date.now();
    while (Date.now() - startTime < timeoutMs) {
      if (await condition()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, pollingMs));
    }
    throw new Error(`Condition not met within ${timeoutMs}ms`);
  },

  /**
   * Measures execution time of an operation
   * @param operation - Operation to measure
   * @param operationName - Name of the operation
   */
  measureExecutionTime: async <T>(
    operation: () => Promise<T>,
    operationName: string,
  ): Promise<{ result: T; duration: number }> => {
    const startTime = Date.now();
    const result = await operation();
    const duration = Date.now() - startTime;
    console.log(`${operationName} completed in ${duration}ms`);
    return { result, duration };
  },

  /**
   * Generates random test data
   * @param type - Type of data to generate
   */
  generateTestData: (type: "email" | "username" | "password" | "string") => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);

    switch (type) {
      case "email":
        return `test_${random}@example.com`;
      case "username":
        return `user_${random}_${timestamp}`;
      case "password":
        return `Pass${random}!${timestamp}`;
      case "string":
        return `test_${random}_${timestamp}`;
      default:
        return `test_${random}`;
    }
  },

  /**
   * Validates mobile device state
   * @param mobile - MobilePage instance
   */
  validateDeviceState: async (mobile: MobilePage): Promise<boolean> => {
    try {
      // Check if device is responsive
      const isResponsive = await mobile.visible("status_bar");
      return isResponsive;
    } catch (error) {
      console.log("Device state validation failed:", error);
      return false;
    }
  },

  /**
   * Creates test data set for data-driven testing
   * @param dataSet - Array of test data objects
   */
  createTestDataSets: <T extends Record<string, any>>(
    dataSet: T[],
  ): Array<{ name: string; data: T }> => {
    return dataSet.map((data, index) => ({
      name: `Data set ${index + 1}`,
      data,
    }));
  },
};
