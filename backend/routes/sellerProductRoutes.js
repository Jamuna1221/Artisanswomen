const express = require("express");
const router = express.Router();
const { protectSeller } = require("../middleware/authMiddleware");
const { uploadProductImages } = require("../config/cloudinary");
const {
  getMyProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  toggleVisibility,
  toggleFeatured,
  updateStatus,
  inlineEdit,
  deleteImage,
  getProductReviews,
  getProductQuestions,
  answerQuestion,
  getProductAnalytics,
} = require("../controllers/sellerProductController");

// ── Product CRUD ──────────────────────────────────
router.get("/", protectSeller, getMyProducts);
router.post("/", protectSeller, uploadProductImages, createProduct);
router.get("/:id", protectSeller, getProductById);
router.put("/:id", protectSeller, uploadProductImages, updateProduct);
router.delete("/:id", protectSeller, deleteProduct);

// ── Special Actions ───────────────────────────────
router.post("/:id/duplicate", protectSeller, duplicateProduct);
router.patch("/:id/visibility", protectSeller, toggleVisibility);
router.patch("/:id/featured", protectSeller, toggleFeatured);
router.patch("/:id/status", protectSeller, updateStatus);
router.patch("/:id/inline", protectSeller, inlineEdit);

// ── Image Management ──────────────────────────────
router.delete("/:id/images/:imgIndex", protectSeller, deleteImage);

// ── Reviews ──────────────────────────────────────
router.get("/:id/reviews", protectSeller, getProductReviews);

// ── Questions ────────────────────────────────────
router.get("/:id/questions", protectSeller, getProductQuestions);
router.post("/:id/questions/:qid/answer", protectSeller, answerQuestion);

// ── Analytics ────────────────────────────────────
router.get("/:id/analytics", protectSeller, getProductAnalytics);

module.exports = router;
