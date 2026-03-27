const express = require("express");
const {
  getArtisans,
  getBuyers,
  updateUserStatus,
  getUserById,
  approveSeller,
  rejectSeller,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/artisans", protect, getArtisans);
router.get("/buyers", protect, getBuyers);
router.get("/:id", protect, getUserById);
router.put("/:id/status", protect, updateUserStatus);

// Approval System
router.patch("/artisans/:id/approve", protect, approveSeller);
router.patch("/artisans/:id/reject", protect, rejectSeller);

module.exports = router;
