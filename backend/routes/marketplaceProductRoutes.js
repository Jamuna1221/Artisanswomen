const express = require("express");
const router = express.Router();
const { 
  listPublicProducts, 
  getProductsByCategoryName, 
  getProductById, 
  getRelatedProducts 
} = require("../controllers/marketplaceProductController");
const { getProductReviews, submitReview } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

// Public: list products
router.get("/", listPublicProducts);

// Single product details
router.get("/:productId", getProductById);

// Related products
router.get("/:productId/related", getRelatedProducts);

// Reviews
router.get("/:productId/reviews", getProductReviews);
router.post("/reviews", protect, submitReview);

// List by category
router.get("/category/:categoryName", getProductsByCategoryName);

module.exports = router;
