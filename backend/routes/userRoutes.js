const express = require("express");
const {
  getArtisans,
  getBuyers,
  updateUserStatus,
  getUserById,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/artisans", protect, getArtisans);
router.get("/buyers", protect, getBuyers);
router.get("/:id", protect, getUserById);
router.put("/:id/status", protect, updateUserStatus);

module.exports = router;
