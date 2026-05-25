import { MobilePage } from "../MobilePage";
import { LoginPageLocators } from "../locators/login-page.locators";
import { test, expect } from "@playwright/test";

export class LoginPage {
  constructor(private mobile: MobilePage) {}

  /**
   * Verifies all login page elements are visible
   * @throws Error if any element is not found
   */
  async verifyLoginPage() {
    await test.step("📋 Verify login page elements", async () => {
      const elements = [
        { name: "App Logo", locator: LoginPageLocators.appLogo },
        { name: "Username Field", locator: LoginPageLocators.usernameField },
        { name: "Password Field", locator: LoginPageLocators.passwordField },
        { name: "Login Button", locator: LoginPageLocators.loginButton },
      ];

      for (const element of elements) {
        await test.step(`✓ Verify ${element.name} is visible`, async () => {
          await this.mobile.waitFor(element.locator);
          const isVisible = await this.mobile.visible(element.locator);
          expect(isVisible, `${element.name} should be visible`).toBe(true);
        });
      }
    });
  }

  /**
   * Fills the username field
   * @param username - The username to enter
   */
  async fillUsername(username: string) {
    await test.step(`📝 Enter username: "${username}"`, async () => {
      expect(username, "Username should not be empty").toBeTruthy();
      await this.mobile.fill(LoginPageLocators.usernameField, username);
    });
  }

  /**
   * Fills the password field
   * @param password - The password to enter
   */
  async fillPassword(password: string) {
    await test.step(`🔒 Enter password: ***`, async () => {
      expect(password, "Password should not be empty").toBeTruthy();
      await this.mobile.fill(LoginPageLocators.passwordField, password);
    });
  }

  /**
   * Performs complete login flow
   * @param username - The username to enter
   * @param password - The password to enter
   */
  async performLogin(username: string, password: string) {
    await test.step("🔐 Perform login authentication", async () => {
      // Verify preconditions
      await test.step("Precondition: Verify login page is loaded", async () => {
        const isLogoVisible = await this.mobile.visible(
          LoginPageLocators.appLogo,
        );
        expect(isLogoVisible, "Login page should be loaded").toBe(true);
      });

      // Enter credentials
      await this.fillUsername(username);
      await this.fillPassword(password);

      // Submit login
      await test.step("👆 Click login button", async () => {
        await this.mobile.waitFor(LoginPageLocators.loginButton);
        await this.mobile.click(LoginPageLocators.loginButton);
      });

      // Wait for response - check if error popup appears (failed login) or products page loads (successful login)
      await test.step("⏳ Wait for authentication response", async () => {
        await this.mobile.driver.pause(2000);

        // Check if error popup appeared (failed login)
        const errorPopupExists = await this.mobile.xpathExists(
          LoginPageLocators.errorPopup,
        );

        if (!errorPopupExists) {
          // If no error popup, wait for products page to load (successful login)
          await test.step("✓ Login appears successful, waiting for products page", async () => {
            await this.mobile.driver.pause(3000);
          });
        }
      });
    });
  }

  /**
   * Verifies error popup appears with expected content
   * @param expectedHeader - Expected error header text
   * @param expectedText - Expected error message text
   */
  async verifyErrorAppear(expectedHeader: string, expectedText: string) {
    await test.step(`❌ Verify error popup: "${expectedHeader}"`, async () => {
      await test.step("Check error popup is visible", async () => {
        const isPopupVisible = await this.mobile.xpathExists(
          LoginPageLocators.errorPopup,
        );
        expect(isPopupVisible, "Error popup should be visible").toBe(true);
      });

      await test.step("Verify error header text", async () => {
        const actualHeader = await this.mobile.textByXPath(
          LoginPageLocators.errorHeader,
        );
        expect(actualHeader).toBe(expectedHeader);
      });

      await test.step("Verify error message text", async () => {
        const actualText = await this.mobile.textByXPath(
          LoginPageLocators.errorText,
        );
        expect(actualText).toBe(expectedText);
      });
    });
  }

  /**
   * Verifies error popup has disappeared
   */
  async verifyErrorPopupDisappear() {
    await test.step("✅ Verify error popup has disappeared", async () => {
      await test.step("Check error popup is not visible", async () => {
        const isPopupVisible = await this.mobile.xpathExists(
          LoginPageLocators.errorPopup,
        );
        expect(isPopupVisible, "Error popup should not be visible").toBe(false);
      });

      await test.step("Check error header is not visible", async () => {
        const isHeaderVisible = await this.mobile.xpathExists(
          LoginPageLocators.errorHeader,
        );
        expect(isHeaderVisible, "Error header should not be visible").toBe(
          false,
        );
      });
    });
  }

  /**
   * Clicks the OK button on error popup
   */
  async clickOkButton() {
    await test.step("👆 Click OK button on error popup", async () => {
      await test.step("Verify OK button is clickable", async () => {
        const isButtonVisible = await this.mobile.xpathExists(
          LoginPageLocators.okButton,
        );
        expect(isButtonVisible, "OK button should be visible").toBe(true);
      });

      await this.mobile.clickByXPath(LoginPageLocators.okButton);
    });
  }

  /**
   * Dismisses error popup (wrapper method)
   */
  async dismissErrorPopup() {
    await test.step("🚫 Dismiss error popup", async () => {
      await this.clickOkButton();
      await this.verifyErrorPopupDisappear();
    });
  }

  /**
   * Gets current username field value
   */
  getUsernameValue(): Promise<string> {
    return test.step("📖 Get current username value", async () => {
      return await this.mobile.text(LoginPageLocators.usernameField);
    });
  }

  /**
   * Clears username field
   */
  async clearUsernameField() {
    await test.step("🗑️ Clear username field", async () => {
      await this.mobile.fill(LoginPageLocators.usernameField, "");
    });
  }

  /**
   * Clears password field
   */
  async clearPasswordField() {
    await test.step("🗑️ Clear password field", async () => {
      await this.mobile.fill(LoginPageLocators.passwordField, "");
    });
  }
}
