const express = require("express");
const router = express.Router();
const { 
  login, 
  verifyOTP, 
  resendOTP, 
  getProfile, 
  updateProfile, 
  getActivity,
  changePassword,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getSystemSettings,
  updateSystemSettings
} = require("../controllers/adminAuthController");
const { protect } = require("../middleware/authMiddleware");

// Admin Auth Routes
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// Protected Admin Access
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/activity", protect, getActivity);

// Notifications
router.get("/notifications", protect, getNotifications);
router.put("/notifications/read-all", protect, markAllAsRead);
router.put("/notifications/:id/read", protect, markAsRead);

// System Settings
router.get("/settings", protect, getSystemSettings);
router.put("/settings", protect, updateSystemSettings);

module.exports = router;
