const Review = require("../models/Review");
const Order = require("../models/Order");
const Product = require("../models/Product");

/**
 * GET /api/reviews/:productId
 */
exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).populate("buyerId", "name avatar").sort("-createdAt");
    
    const summary = {
      average: 0,
      count: reviews.length,
      stars: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => {
        summary.stars[r.rating]++;
        return acc + r.rating;
      }, 0);
      summary.average = (sum / reviews.length).toFixed(1);
    }

    res.status(200).json({ reviews, summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/reviews
 * Support verified purchase check
 */
exports.submitReview = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { productId, rating, comment } = req.body;

    // Check if the user purchased this product
    const order = await Order.findOne({ buyerId, "items.productId": productId });
    const isVerifiedPurchase = !!order;

    // Prevent duplicate reviews
    const existing = await Review.findOne({ productId, buyerId });
    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      productId,
      buyerId,
      rating: parseInt(rating),
      comment,
      isVerifiedPurchase
    });

    // RECALCULATE PRODUCT RATING
    const allReviews = await Review.find({ productId });
    const count = allReviews.length;
    const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / count;

    await Product.findByIdAndUpdate(productId, {
      rating: avg,
      ratingCount: count
    });

    const populated = await review.populate("buyerId", "name avatar");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
