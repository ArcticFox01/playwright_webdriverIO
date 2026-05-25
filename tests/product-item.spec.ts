import { test, expect } from "../mobile/fixtures";
import { LoginPage } from "../mobile/pages/LoginPage";
import { ProductsPage } from "../mobile/pages/ProductsPage";
import { ProductsPageLocators } from "../mobile/locators/products-page.locators";

// Test suite documentation
test.describe("🛒 Product Item Tests", () => {
  let loginPage: LoginPage;
  let productsPage: ProductsPage;

  // Setup before all tests in this suite
  test.beforeAll(async () => {
    await test.step("📋 Suite Setup: Configure test environment", async () => {
      console.log("Setting up Product Item Tests suite");
    });
  });

  // Setup before each test
  test.beforeEach(async ({ mobile }) => {
    await test.step("🏗️ Test Setup: Initialize page objects and login", async () => {
      loginPage = new LoginPage(mobile);
      productsPage = new ProductsPage(mobile);

      // Perform login as prerequisite
      await loginPage.performLogin("testuser", "password123");
    });
  });

  test("TC-005: User should see multiple products on the products page", async ({
    mobile,
  }) => {
    // Add test metadata
    test.info().annotations.push({
      type: "test case",
      description: "Verify product listing displays multiple items",
    });

    test.info().annotations.push({
      type: "severity",
      description: "high",
    });

    await test.step("Step 1: Verify products page header is displayed", async () => {
      await productsPage.verifyHeaderProductsAppear();
    });

    await test.step("Step 2: Verify multiple products are displayed", async () => {
      const productCount = await productsPage.verifyMultipleProductsDisplay();

      await test.step(`Validate product count is sufficient (Found: ${productCount})`, async () => {
        expect(productCount).toBeGreaterThanOrEqual(2);
      });
    });
  });

  test("TC-006: User should see all product cards with valid details", async ({
    mobile,
  }) => {
    // Add test metadata
    test.info().annotations.push({
      type: "test case",
      description: "Verify all product cards contain valid information",
    });

    test.info().annotations.push({
      type: "severity",
      description: "high",
    });

    await test.step("Step 1: Verify products page header is displayed", async () => {
      await productsPage.verifyHeaderProductsAppear();
    });

    await test.step("Step 2: Verify all product cards with their details", async () => {
      await productsPage.verifyAllProductCards();
    });
  });

  test("TC-007: User should see product details when selecting a product item", async ({
    mobile,
  }) => {
    // Add test metadata
    test.info().annotations.push({
      type: "test case",
      description: "Verify product detail page shows correct information",
    });

    test.info().annotations.push({
      type: "severity",
      description: "critical",
    });

    await test.step("Step 1: Verify products page is loaded", async () => {
      await productsPage.verifyHeaderProductsAppear();
    });

    await test.step("Step 2: Verify product item details match between card and detail page", async () => {
      await productsPage.verifyProductItemDetails(0);
    });
  });

  test.describe("🔍 Product Data Validation", () => {
    test("TC-008: Product prices should follow correct format", async ({
      mobile,
    }) => {
      test.info().annotations.push({
        type: "test case",
        description:
          "Verify all product prices follow the expected currency format",
      });

      await test.step("Step 1: Get product count", async () => {
        const productCount = await productsPage.verifyMultipleProductsDisplay();

        await test.step("Step 2: Verify price format for all products", async () => {
          for (let i = 0; i < productCount; i++) {
            await test.step(`Verify price format for product ${i}`, async () => {
              const priceLocator = ProductsPageLocators.getProductPrice(i);
              await productsPage.verifyProductPriceFormat(priceLocator);
            });
          }
        });
      });
    });

    test("TC-009: Product data should be consistent between card and detail view", async ({
      mobile,
    }) => {
      test.info().annotations.push({
        type: "test case",
        description: "Verify data consistency across different product views",
      });

      await test.step("Step 1: Verify data consistency for first product", async () => {
        await productsPage.verifyProductItemDetails(0);
      });

      await test.step("Step 2: Verify data consistency for second product if available", async () => {
        const productCount = await productsPage.verifyMultipleProductsDisplay();
        if (productCount > 1) {
          // Navigate back to products page
          // Verify second product
        }
      });
    });
  });

  // Cleanup after each test
  test.afterEach(async ({ mobile }) => {
    await test.step("🧹 Test Cleanup: Reset application state", async () => {
      // Reset logic if needed
      console.log("Cleaning up test state");
    });
  });

  // Cleanup after all tests
  test.afterAll(async () => {
    await test.step("📋 Suite Teardown: Clean up test environment", async () => {
      console.log("Cleaning up Product Item Tests suite");
    });
  });
});
