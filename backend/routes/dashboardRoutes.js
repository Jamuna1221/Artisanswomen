const express = require("express");
const { getDashboardStats, getRecentActivities } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/recent", protect, getRecentActivities);

module.exports = router;
