// import { Browser } from "webdriverio";
import { test, expect } from "@playwright/test";

export class MobilePage {
  constructor(public driver: any) {}

  /**
   * Clicks an element with automatic wait and verification
   * @param id - The element ID
   * @param options - Optional click options
   */
  async click(id: string, options?: { timeout?: number }) {
    const timeout = options?.timeout || 15000;

    await test.step(`👆 Click element: "${id}"`, async () => {
      const el = await this.driver.$(`~${id}`);

      await test.step(`Wait for element to be displayed`, async () => {
        await el.waitForDisplayed({ timeout });
      });

      await test.step(`Verify element is enabled`, async () => {
        const isEnabled = await el.isEnabled();
        expect(isEnabled, `Element "${id}" should be enabled`).toBe(true);
      });

      await test.step(`Perform click action`, async () => {
        await el.click();
      });
    });
  }

  /**
   * Fills an input field with text
   * @param id - The element ID
   * @param text - The text to enter
   * @param options - Optional fill options
   */
  async fill(
    id: string,
    text: string,
    options?: { clearFirst?: boolean; timeout?: number },
  ) {
    const timeout = options?.timeout || 15000;
    const clearFirst = options?.clearFirst ?? true;

    await test.step(`📝 Fill element "${id}" with text: "${text}"`, async () => {
      const el = await this.driver.$(`~${id}`);

      await test.step(`Wait for element to be displayed`, async () => {
        await el.waitForDisplayed({ timeout });
      });

      if (clearFirst) {
        await test.step(`Clear existing text`, async () => {
          await el.clearValue();
        });
      }

      await test.step(`Enter new text`, async () => {
        await el.setValue(text);
      });

      await this.hideKeyboard();
    });
  }

  /**
   * Gets text from an element
   * @param id - The element ID
   * @returns The element's text content
   */
  async text(id: string): Promise<string> {
    return await test.step(`📖 Get text from element: "${id}"`, async () => {
      const el = await this.driver.$(`~${id}`);
      await el.waitForDisplayed({ timeout: 15000 });
      return await el.getText();
    });
  }

  /**
   * Checks if an element is visible
   * @param id - The element ID
   * @returns Whether the element is visible
   */
  async visible(id: string): Promise<boolean> {
    return await test.step(`👁️ Check visibility of element: "${id}"`, async () => {
      try {
        const el = await this.driver.$(`~${id}`);
        return await el.isDisplayed();
      } catch (error) {
        return false;
      }
    });
  }

  /**
   * Waits for an element to be displayed
   * @param id - The element ID
   * @param timeout - Maximum wait time in milliseconds
   */
  async waitFor(id: string, timeout = 15000) {
    await test.step(`⏳ Wait for element: "${id}" (timeout: ${timeout}ms)`, async () => {
      const el = await this.driver.$(`~${id}`);
      await el.waitForDisplayed({ timeout });
    });
  }

  /**
   * Waits for an element to not be displayed
   * @param id - The element ID
   * @param timeout - Maximum wait time in milliseconds
   */
  async waitForNotVisible(id: string, timeout = 15000) {
    await test.step(`⏳ Wait for element to disappear: "${id}" (timeout: ${timeout}ms)`, async () => {
      const el = await this.driver.$(`~${id}`);
      await el.waitForDisplayed({ timeout, reverse: true });
    });
  }

  /**
   * Verifies element text equals expected value
   * @param id - The element ID
   * @param expectedText - The expected text
   */
  async textEquals(id: string, expectedText: string): Promise<boolean> {
    return await test.step(`✓ Verify element "${id}" text equals: "${expectedText}"`, async () => {
      const actualText = await this.text(id);
      return actualText === expectedText;
    });
  }

  /**
   * Verifies element text contains expected value
   * @param id - The element ID
   * @param expectedText - The expected text
   */
  async textContains(id: string, expectedText: string): Promise<boolean> {
    return await test.step(`✓ Verify element "${id}" text contains: "${expectedText}"`, async () => {
      const actualText = await this.text(id);
      return actualText.includes(expectedText);
    });
  }

  /**
   * Checks if an element exists by XPath
   * @param xpath - The XPath selector
   * @returns Whether the element exists
   */
  async xpathExists(xpath: string): Promise<boolean> {
    return await test.step(`🔍 Check if element exists by XPath: "${xpath}"`, async () => {
      try {
        const elements = await this.driver.$$(xpath);
        return elements.length > 0;
      } catch (error) {
        return false;
      }
    });
  }

  /**
   * Counts elements matching XPath
   * @param xpath - The XPath selector
   * @returns The count of matching elements
   */
  async xpathCount(xpath: string): Promise<number> {
    return await test.step(`🔢 Count elements matching XPath: "${xpath}"`, async () => {
      const elements = await this.driver.$$(xpath);
      return elements.length;
    });
  }

  /**
   * Clicks an element by XPath
   * @param xpath - The XPath selector
   */
  async clickByXPath(xpath: string) {
    await test.step(`👆 Click element by XPath: "${xpath}"`, async () => {
      const el = await this.driver.$(xpath);
      await el.waitForDisplayed({ timeout: 15000 });
      await el.click();
    });
  }

  /**
   * Gets text from an element by XPath
   * @param xpath - The XPath selector
   * @returns The element's text content
   */
  async textByXPath(xpath: string): Promise<string> {
    return await test.step(`📖 Get text by XPath: "${xpath}"`, async () => {
      const el = await this.driver.$(xpath);
      await el.waitForDisplayed({ timeout: 15000 });
      return await el.getText();
    });
  }

  /**
   * Hides the iOS keyboard
   */
  async hideKeyboard() {
    await test.step("🔽 Hide keyboard", async () => {
      try {
        await this.driver.touchPerform([
          {
            action: "tap",
            options: { x: 101, y: 101 },
          },
        ]);
      } catch (error) {
        // Ignore error if keyboard is not visible
      }
    });
  }

  /**
   * Swipes screen by percentage
   * @param startX - Start X position (0-100)
   * @param startY - Start Y position (0-100)
   * @param endX - End X position (0-100)
   * @param endY - End Y position (0-100)
   */
  async swipeByPercent(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ) {
    await test.step(`👆 Swipe screen from (${startX}%,${startY}%) to (${endX}%,${endY}%)`, async () => {
      const size = await this.driver.getWindowRect();
      const x1 = Math.floor((size.width * startX) / 100);
      const y1 = Math.floor((size.height * startY) / 100);
      const x2 = Math.floor((size.width * endX) / 100);
      const y2 = Math.floor((size.height * endY) / 100);

      await this.driver.touchPerform([
        {
          action: "press",
          options: { x: x1, y: y1 },
        },
        {
          action: "moveTo",
          options: { x: x2, y: y2 },
        },
        {
          action: "release",
        },
      ]);
    });
  }

  /**
   * Swipes from right to left
   */
  async swipeRightToLeft() {
    await this.swipeByPercent(90, 50, 10, 50);
  }

  /**
   * Swipes from left to right
   */
  async swipeLeftToRight() {
    await this.swipeByPercent(10, 50, 90, 50);
  }

  /**
   * Swipes from top to bottom
   */
  async swipeTopToDown() {
    await this.swipeByPercent(50, 90, 50, 10);
  }

  /**
   * Swipes from bottom to top
   */
  async swipeDownToTop() {
    await this.swipeByPercent(50, 10, 50, 90);
  }

  /**
   * Swipes until element is found
   * @param elementId - The element ID to find
   * @param maxSwipes - Maximum number of swipes
   * @returns Whether the element was found
   */
  async swipeUntilElementFound(
    elementId: string,
    maxSwipes = 10,
  ): Promise<boolean> {
    return await test.step(`👆 Swipe until element found: "${elementId}"`, async () => {
      for (let i = 0; i < maxSwipes; i++) {
        if (await this.visible(elementId)) {
          return true;
        }
        await this.swipeTopToDown();
      }
      return await this.visible(elementId);
    });
  }

  /**
   * Gets all available contexts
   * @returns List of available contexts
   */
  async getContexts(): Promise<string[]> {
    return await test.step("📋 Get available contexts", async () => {
      return await this.driver.getContexts();
    });
  }

  /**
   * Gets current context
   * @returns Current context name
   */
  async getContext(): Promise<string> {
    return await test.step("📋 Get current context", async () => {
      return await this.driver.getContext();
    });
  }

  /**
   * Sets the current context
   * @param context - The context name to switch to
   */
  async setContext(context: string) {
    await test.step(`🔄 Switch context to: "${context}"`, async () => {
      await this.driver.switchContext(context);
    });
  }

  /**
   * Switches to WebView context
   */
  async switchToWebView() {
    await test.step("🔄 Switch to WebView context", async () => {
      const contexts = await this.getContexts();
      console.log("Available contexts:", contexts);

      for (const context of contexts) {
        if (context === "NATIVE_APP") {
          continue;
        }
        if (context.startsWith("WEBVIEW")) {
          await this.setContext(context);
          console.log(`Switched to context: ${context}`);
          return;
        }
      }
    });
  }

  /**
   * Takes a screenshot
   * @param name - Screenshot name
   * @returns Screenshot buffer
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return await test.step(`📸 Take screenshot: "${name}"`, async () => {
      return await this.driver.saveScreenshot(
        `test-results/screenshots/${name}.png`,
      );
    });
  }

  /**
   * Gets current page URL
   * @returns Current URL
   */
  async getUrl(): Promise<string> {
    return await test.step("🔗 Get current URL", async () => {
      return await this.driver.getUrl();
    });
  }
}
