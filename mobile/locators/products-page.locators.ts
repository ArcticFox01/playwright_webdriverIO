export const ProductsPageLocators = {
  header: '//XCUIElementTypeStaticText[@name="Marketplace"]',
  screen: "marketplace_screen",
  itemsGrid: "items_grid",

  // Product cards
  productCards:
    '//XCUIElementTypeOther[@name="items_grid"]/XCUIElementTypeStaticText',

  // Product item details (index-based)
  getProductImage: (index: number) => "item_index_image_placeholder",
  getProductName: (index: number) => "item_index_name",
  getProductCategory: (index: number) => "item_index_category",
  getProductPrice: (index: number) => "item_index_price",
  getProductDesc: (index: number) => "item_index_desc",
  getProductCard: (index: number) =>
    "item_index_image_placeholder-item_index_details-item_index_desc",

  // Product detail page
  detailName: "detail_name",
  detailCategory: "detail_category",
  detailPrice: "detail_price",
  detailDescLabel: "detail_desc_label",
  detailDesc: "detail_desc",
  detailReviewsTitle: "detail_reviews_title",
  detailReviews:
    '//XCUIElementTypeStaticText[@name="detail_reviews-detail_reviews-detail_reviews"]//XCUIElementTypeStaticText[@name="detail_reviews"]',
};
