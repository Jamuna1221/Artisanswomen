const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  getMyOrders,
  getMyWishlist,
  submitComplaint,
  getDashboardStats,
} = require("../controllers/accountController");

// Profile & Security
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);
router.put("/change-password", protect, changePassword);

// Dashboard
router.get("/stats", protect, getDashboardStats);

// Addresses
router.get("/addresses", protect, getAddresses);
router.post("/addresses", protect, addAddress);

// Orders
router.get("/orders", protect, getMyOrders);

// Wishlist
router.get("/wishlist", protect, getMyWishlist);

// Complaints
router.post("/complaint", protect, submitComplaint);

module.exports = router;
