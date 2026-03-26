const express = require("express");
const {
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, updateOrderStatus);

module.exports = router;
