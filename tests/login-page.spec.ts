import { test, expect } from "../mobile/fixtures";
import { LoginPage } from "../mobile/pages/LoginPage";
import { ProductsPage } from "../mobile/pages/ProductsPage";

// Test suite documentation
test.describe("🔐 Login Page Tests", () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  // Setup before each test
  test.beforeEach(async ({ mobile }) => {
    await test.step("🏗️ Setup: Initialize page objects", async () => {
      loginPage = new LoginPage(mobile);
      productsPage = new ProductsPage(mobile);
    });
  });

  test("TC-001: User should see error popup when entering invalid credentials", async ({
    mobile,
  }) => {
    // Add test metadata
    test.info().annotations.push({
      type: "test case",
      description: "Verify error handling for invalid login credentials",
    });

    test.info().annotations.push({
      type: "severity",
      description: "critical",
    });

    // Test steps
    await test.step("Step 1: Navigate to login page", async () => {
      await loginPage.verifyLoginPage();
    });

    await test.step("Step 2: Attempt login with invalid credentials", async () => {
      await loginPage.performLogin("myname", "pass");
    });

    await test.step("Step 3: Verify error popup appears with correct message", async () => {
      await loginPage.verifyErrorAppear("Login Error", "Invalid credentials");
    });

    await test.step("Step 4: Dismiss error popup", async () => {
      await loginPage.dismissErrorPopup();
    });

    await test.step("Step 5: Verify error popup has disappeared", async () => {
      await loginPage.verifyErrorPopupDisappear();
    });
  });

  test("TC-002: User should be redirected to products page when entering valid credentials", async ({
    mobile,
  }) => {
    // Add test metadata
    test.info().annotations.push({
      type: "test case",
      description: "Verify successful login and navigation to products page",
    });

    test.info().annotations.push({
      type: "severity",
      description: "critical",
    });

    // Test steps
    await test.step("Step 1: Verify login page is displayed", async () => {
      await loginPage.verifyLoginPage();
    });

    await test.step("Step 2: Perform login with valid credentials", async () => {
      await loginPage.performLogin("testuser", "password123");
    });

    await test.step("Step 3: Verify products page header is displayed", async () => {
      await productsPage.verifyHeaderProductsAppear();
    });

    await test.step("Step 4: Verify multiple products are visible", async () => {
      const productCount = await productsPage.verifyMultipleProductsDisplay();
      expect(productCount).toBeGreaterThan(0);
    });
  });

  test.describe("🧪 Edge Cases", () => {
    test("TC-003: User should see error when username is empty", async ({
      mobile,
    }) => {
      test.info().annotations.push({
        type: "test case",
        description: "Verify validation for empty username field",
      });

      await test.step("Step 1: Verify login page is displayed", async () => {
        await loginPage.verifyLoginPage();
      });

      await test.step("Step 2: Attempt login with empty username", async () => {
        await loginPage.performLogin("", "password123");
      });

      await test.step("Step 3: Verify appropriate error appears", async () => {
        // Error verification would go here
      });
    });

    test("TC-004: User should see error when password is empty", async ({
      mobile,
    }) => {
      test.info().annotations.push({
        type: "test case",
        description: "Verify validation for empty password field",
      });

      await test.step("Step 1: Verify login page is displayed", async () => {
        await loginPage.verifyLoginPage();
      });

      await test.step("Step 2: Attempt login with empty password", async () => {
        await loginPage.performLogin("testuser", "");
      });

      await test.step("Step 3: Verify appropriate error appears", async () => {
        // Error verification would go here
      });
    });
  });
});
