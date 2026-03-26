const express = require("express");
const {
  getVerifications,
  getVerificationById,
  updateVerificationStatus,
} = require("../controllers/verificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getVerifications);
router.get("/:id", protect, getVerificationById);
router.put("/:id", protect, updateVerificationStatus);

module.exports = router;
