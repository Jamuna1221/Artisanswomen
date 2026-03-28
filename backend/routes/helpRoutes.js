const express = require("express");
const { trackOrder, getFAQs, addFAQ } = require("../controllers/helpController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// TRACK Order
router.get("/track/:orderId", trackOrder);

// FAQs
router.get("/faqs", getFAQs);
router.post("/faqs", protect, addFAQ); // Protect later to admin-only if needed

module.exports = router;
