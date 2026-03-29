const express = require("express");
const { 
  getProductReviews, 
  submitReview 
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/", protect, submitReview);

module.exports = router;
