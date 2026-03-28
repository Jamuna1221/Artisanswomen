const express = require("express");
const {
  getProducts,
  updateProductStatus,
  deleteProduct,
  getProductById,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getProducts);
router.get("/:id", protect, getProductById);
router.put("/:id/status", protect, updateProductStatus); 
router.delete("/:id", protect, deleteProduct);

module.exports = router;
