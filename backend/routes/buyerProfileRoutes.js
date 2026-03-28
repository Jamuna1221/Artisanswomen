// routes/buyerProfileRoutes.js

const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/buyerProfileController");
const { protect } = require("../middleware/authMiddleware"); // adjust path as needed

// GET  /api/buyer/profile  → fetch logged-in user's profile
// PUT  /api/buyer/profile  → update logged-in user's profile
router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

module.exports = router;
