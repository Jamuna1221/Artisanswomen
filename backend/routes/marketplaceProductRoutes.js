const express = require("express");
const router = express.Router();
const { protectSeller } = require("../middleware/authMiddleware");
const { uploadProductImages } = require("../config/cloudinary");
const { listPublicProducts } = require("../controllers/marketplaceProductController");
const { createProduct } = require("../controllers/sellerProductController");

// Public: list products (optional ?category=ExactName)
router.get("/", listPublicProducts);

// Seller-only: create product (same handler as /api/seller/products)
router.post("/", protectSeller, uploadProductImages, createProduct);

module.exports = router;
