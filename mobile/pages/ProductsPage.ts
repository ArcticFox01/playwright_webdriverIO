import { MobilePage } from "../MobilePage";
import { ProductsPageLocators } from "../locators/products-page.locators";
import { test, expect } from "@playwright/test";

export interface ProductData {
  name: string;
  category: string;
  price: string;
  desc: string;
}

export class ProductsPage {
  constructor(private mobile: MobilePage) {}

  /**
   * Verifies products page header is displayed
   */
  async verifyHeaderProductsAppear() {
    await test.step("🏪 Verify products page header", async () => {
      await test.step("Wait for products screen to load", async () => {
        try {
          await this.mobile.waitFor(ProductsPageLocators.screen, 20000);
        } catch (error) {
          await test.step("Screen element not found, trying alternative approach", async () => {
            console.log(
              "marketplace_screen not found, waiting for header directly",
            );
            await this.mobile.driver.pause(2000);
          });
        }
      });

      await test.step("Verify marketplace header is displayed with correct text", async () => {
        try {
          const header = await this.mobile.textByXPath(
            ProductsPageLocators.header,
          );
          expect(header).toBe("Marketplace");
        } catch (error) {
          await test.step("Header XPath not found, trying alternative approaches", async () => {
            console.log(
              "XPath header not found, trying to find any Marketplace text",
            );

            // Try to find any element containing "Marketplace" text
            try {
              const alternativeHeader =
                '//XCUIElementTypeStaticText[contains(@name, "Market")]';
              const headerExists =
                await this.mobile.xpathExists(alternativeHeader);
              expect(
                headerExists,
                "Should find a Marketplace header element",
              ).toBe(true);

              if (headerExists) {
                const headerText =
                  await this.mobile.textByXPath(alternativeHeader);
                console.log(`Found header text: ${headerText}`);
              }
            } catch (altError) {
              await test.step("Taking screenshot for debugging", async () => {
                console.log("No Marketplace header found, taking screenshot");
                await this.mobile.driver.takeScreenshot();
              });
              throw new Error("Marketplace header not found after login");
            }
          });
        }
      });
    });
  }

  /**
   * Verifies multiple products are displayed on the page
   * @returns The count of products found
   */
  async verifyMultipleProductsDisplay(): Promise<number> {
    return await test.step("📦 Verify multiple products are displayed", async () => {
      const productCount = await this.mobile.xpathCount(
        ProductsPageLocators.productCards,
      );

      await test.step(`Validate product count: ${productCount}`, async () => {
        expect(productCount).toBeGreaterThan(0);
      });

      await test.step("Log product count for verification", async () => {
        console.log(`✅ Found ${productCount} products on the page`);
      });

      return productCount;
    });
  }

  /**
   * Verifies a specific product card's details
   * @param index - The index of the product to verify
   */
  async verifyProductCardDetails(index: number) {
    await test.step(`🔍 Verify product card details (Index: ${index})`, async () => {
      // Verify items container exists
      await test.step("Verify items grid is visible", async () => {
        await this.mobile.waitFor(ProductsPageLocators.itemsGrid);
      });

      const elements = [
        {
          name: "Product Name",
          locator: ProductsPageLocators.getProductName(index),
        },
        {
          name: "Product Price",
          locator: ProductsPageLocators.getProductPrice(index),
        },
        {
          name: "Product Description",
          locator: ProductsPageLocators.getProductDesc(index),
        },
      ];

      for (const element of elements) {
        await test.step(`✓ Verify ${element.name} is visible for product ${index}`, async () => {
          await this.mobile.waitFor(element.locator);
          const isVisible = await this.mobile.visible(element.locator);
          expect(isVisible, `${element.name} should be visible`).toBe(true);
        });
      }

      // Validate price format
      await test.step("💰 Verify price format is correct", async () => {
        await this.verifyProductPriceFormat(
          ProductsPageLocators.getProductPrice(index),
        );
      });
    });
  }

  /**
   * Verifies all product cards on the page
   */
  async verifyAllProductCards() {
    await test.step("📋 Verify all product cards on the page", async () => {
      const productCount = await this.mobile.xpathCount(
        ProductsPageLocators.productCards,
      );

      await test.step(`Validate at least one product exists (Found: ${productCount})`, async () => {
        expect(productCount).toBeGreaterThan(0);
      });

      await test.step("Iterate through all products and verify details", async () => {
        for (let i = 0; i < productCount; i++) {
          await this.verifyProductCardDetails(i);
        }
      });
    });
  }

  /**
   * Verifies items container is visible
   * @param locator - The locator to verify
   * @param expectedText - Optional expected text to verify
   */
  async verifyItemsInProducts(locator: string, expectedText?: string) {
    await test.step("📦 Verify items container", async () => {
      await test.step("Verify items container is visible", async () => {
        await this.mobile.waitFor(locator);
      });

      if (expectedText) {
        await test.step(`Verify expected text: "${expectedText}"`, async () => {
          const actualText = await this.mobile.text(locator);
          expect(actualText).toContain(expectedText);
        });
      }
    });
  }

  /**
   * Verifies price format matches expected pattern
   * @param locator - The price element locator
   */
  async verifyProductPriceFormat(locator: string) {
    await test.step("💰 Verify price format", async () => {
      const price = await this.mobile.text(locator);

      await test.step(`Validate price format: ${price}`, async () => {
        console.log(`Checking price: ${price}`);

        // Verify price format: $\d{1,3}(,\d{3})*(\.\d{2})?
        const priceRegex = /^\$\d{1,3}(,\d{3})*(\.\d{2})?$/;
        const isValidFormat = priceRegex.test(price);

        expect(
          isValidFormat,
          `Price "${price}" should match format $\d{1,3}(,\d{3})*(\.\d{2})?`,
        ).toBe(true);
      });
    });
  }

  /**
   * Extracts product data from a product card
   * @param index - The index of the product card
   * @returns Product data object
   */
  async getDataFromCard(index: number): Promise<ProductData> {
    return await test.step(`📊 Extract product data from card (Index: ${index})`, async () => {
      const locators = {
        name: ProductsPageLocators.getProductName(index),
        category: ProductsPageLocators.getProductCategory(index),
        price: ProductsPageLocators.getProductPrice(index),
        desc: ProductsPageLocators.getProductDesc(index),
      };

      const data: Partial<ProductData> = {};

      await test.step("Extract product name", async () => {
        data.name = await this.mobile.text(locators.name);
      });

      await test.step("Extract product category", async () => {
        data.category = await this.mobile.text(locators.category);
      });

      await test.step("Extract product price", async () => {
        data.price = await this.mobile.text(locators.price);
      });

      await test.step("Extract product description", async () => {
        data.desc = await this.mobile.text(locators.desc);
      });

      return data as ProductData;
    });
  }

  /**
   * Extracts product data from detail page
   * @returns Product data object
   */
  async getDataFromProductDetail(): Promise<ProductData> {
    return await test.step("📊 Extract product data from detail page", async () => {
      const data: Partial<ProductData> = {};

      await test.step("Extract detail name", async () => {
        data.name = await this.mobile.text(ProductsPageLocators.detailName);
      });

      await test.step("Extract detail category", async () => {
        data.category = await this.mobile.text(
          ProductsPageLocators.detailCategory,
        );
      });

      await test.step("Extract detail price", async () => {
        data.price = await this.mobile.text(ProductsPageLocators.detailPrice);
      });

      await test.step("Extract detail description", async () => {
        data.desc = await this.mobile.text(ProductsPageLocators.detailDesc);
      });

      return data as ProductData;
    });
  }

  /**
   * Verifies product item details by comparing card and detail page data
   * @param index - The index of the product to verify
   */
  async verifyProductItemDetails(index: number = 0) {
    await test.step(`🔍 Verify product item details (Index: ${index})`, async () => {
      // Step 1: Extract data from card
      const cardData = await this.getDataFromCard(index);
      await test.step("📋 Card data extracted", async () => {
        console.log("Card data:", JSON.stringify(cardData, null, 2));
      });

      // Step 2: Navigate to product detail
      await test.step("👆 Navigate to product detail page", async () => {
        await this.clickProductCard(index);
      });

      // Step 3: Extract data from detail page
      const detailData = await this.getDataFromProductDetail();
      await test.step("📋 Detail data extracted", async () => {
        console.log("Detail data:", JSON.stringify(detailData, null, 2));
      });

      // Step 4: Compare data
      await test.step("🔎 Compare card and detail page data", async () => {
        this.compareProductData(cardData, detailData);
      });
    });
  }

  /**
   * Clicks on a product card to navigate to detail page
   * @param index - The index of the product card to click
   */
  private async clickProductCard(index: number) {
    await test.step(`👆 Click product card at index ${index}`, async () => {
      const productCard = ProductsPageLocators.getProductCard(index);
      const productImage = ProductsPageLocators.getProductImage(index);

      try {
        await test.step("Try clicking on product card", async () => {
          await this.mobile.waitFor(productCard);
          await this.mobile.click(productCard);
        });
      } catch (error) {
        await test.step("Fallback: Try clicking on product image", async () => {
          console.log("Failed to click product card, trying image approach");
          await this.mobile.waitFor(productImage);
          await this.mobile.click(productImage);
        });
      }
    });
  }

  /**
   * Compares product data from card and detail page
   * @param cardData - Data extracted from product card
   * @param detailData - Data extracted from detail page
   */
  private async compareProductData(
    cardData: ProductData,
    detailData: ProductData,
  ) {
    const fields = ["name", "category", "price", "desc"] as const;

    for (const field of fields) {
      await test.step(`✓ Verify ${field} matches`, async () => {
        expect(
          detailData[field],
          `${field} should match between card and detail`,
        ).toBe(cardData[field]);
      });
    }
  }

  /**
   * Searches for products by name
   * @param searchTerm - The search term to use
   */
  async searchProducts(searchTerm: string) {
    await test.step(`🔍 Search for products: "${searchTerm}"`, async () => {
      // Implementation would go here
      console.log(`Searching for: ${searchTerm}`);
    });
  }

  /**
   * Filters products by category
   * @param category - The category to filter by
   */
  async filterByCategory(category: string) {
    await test.step(`🏷️ Filter products by category: "${category}"`, async () => {
      // Implementation would go here
      console.log(`Filtering by: ${category}`);
    });
  }

  /**
   * Adds product to cart
   * @param index - The index of the product to add
   */
  async addToCart(index: number) {
    await test.step(`🛒 Add product at index ${index} to cart`, async () => {
      // Implementation would go here
      console.log(`Adding product ${index} to cart`);
    });
  }
}
