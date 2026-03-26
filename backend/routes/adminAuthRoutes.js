const express = require("express");
const router = express.Router();
const { login, verifyOTP, resendOTP, getProfile } = require("../controllers/adminAuthController");
const { protect } = require("../middleware/authMiddleware");

// Admin Auth Routes
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// Protected Admin Access
router.get("/profile", protect, getProfile);

module.exports = router;
