const Wishlist = require("../models/Wishlist");

/**
 * GET /api/wishlist
 */
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await Wishlist.find({ userId }).populate("productId");
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /api/wishlist
 * Standard Flipkart wishlist (toggle or add)
 */
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const existing = await Wishlist.findOne({ userId, productId });
    if (existing) {
      return res.status(200).json({ message: "Item already in wishlist" });
    }

    const item = await Wishlist.create({ userId, productId });
    const populated = await item.populate("productId");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/wishlist/:productId
 */
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const deleted = await Wishlist.findOneAndDelete({ userId, productId });
    if (!deleted) return res.status(404).json({ message: "Item not in wishlist" });
    
    res.status(200).json({ message: "Item removed from wishlist", productId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
