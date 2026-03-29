const Order = require("../models/Order");
const Address = require("../models/Address");
const Wishlist = require("../models/Wishlist");
const { findAccountById, orderScopeFilter } = require("../utils/accountLookup");
const { applyProfileFields } = require("../utils/profileUpdate");

/**
 * GET /api/users/profile
 */
const getUserProfile = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(403).json({ message: "Buyer or seller token required" });
    }
    const user = await findAccountById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const safe = user.toObject ? user.toObject() : { ...user };
    delete safe.password;
    delete safe.otp;
    delete safe.otpExpiry;
    delete safe.otpExpires;
    res.status(200).json({ user: safe });
  } catch (err) {
    console.error("getUserProfile:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * GET /api/users/dashboard
 */
const getUserDashboard = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(403).json({ message: "Buyer or seller token required" });
    }
    const uid = req.user._id;
    const orderFilter = orderScopeFilter(uid);

    const totalOrders = await Order.countDocuments(orderFilter);
    const wishlistCount = await Wishlist.countDocuments({ userId: uid });
    const savedAddresses = await Address.countDocuments({ userId: uid });

    const inTransitOrders = await Order.countDocuments({
      ...orderFilter,
      orderStatus: { $in: ["Shipped", "Confirmed", "Processing"] },
    });

    const lastOrder = await Order.findOne(orderFilter).sort({ createdAt: -1 }).lean();

    res.status(200).json({
      totalOrders,
      wishlistCount,
      inTransitOrders,
      savedAddresses,
      lastOrder: lastOrder || null,
    });
  } catch (err) {
    console.error("getUserDashboard:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * PUT /api/users/profile
 * Body: firstName, lastName, phone, gender, bio, city, state (same as account/me)
 */
const updateUserProfile = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(403).json({ message: "Buyer or seller token required" });
    }
    const doc = await findAccountById(req.user._id);
    if (!doc) {
      return res.status(404).json({ message: "User not found" });
    }

    applyProfileFields(doc, req.body);

    await doc.save();
    const safe = doc.toObject();
    delete safe.password;
    delete safe.otp;
    delete safe.otpExpiry;
    res.status(200).json({ user: safe });
  } catch (err) {
    console.error("updateUserProfile:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

module.exports = {
  getUserProfile,
  getUserDashboard,
  updateUserProfile,
};
