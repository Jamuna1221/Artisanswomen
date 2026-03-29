const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getUserProfile,
  getUserDashboard,
  updateUserProfile,
} = require("../controllers/userController");

router.get("/profile", verifyToken, getUserProfile);
router.get("/dashboard", verifyToken, getUserDashboard);
router.put("/profile", verifyToken, updateUserProfile);

module.exports = router;
