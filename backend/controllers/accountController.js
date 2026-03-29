const User = require("../models/User");
const Order = require("../models/Order");
const Address = require("../models/Address");
const Wishlist = require("../models/Wishlist");
const Cart = require("../models/Cart");
const Complaint = require("../models/Complaint");
const bcrypt = require("bcryptjs");
const { findAccountById, orderScopeFilter } = require("../utils/accountLookup");
const { applyProfileFields } = require("../utils/profileUpdate");

// @desc    Get current user profile
// @route   GET /api/account/me
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await findAccountById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const safe = user.toObject ? user.toObject() : { ...user };
    delete safe.password;
    delete safe.otp;
    delete safe.otpExpiry;
    res.json({ success: true, user: safe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/account/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const doc = await findAccountById(req.user._id);
    if (!doc) return res.status(404).json({ message: "User not found" });

    applyProfileFields(doc, req.body);
    const updatedUser = await doc.save();
    const safe = updatedUser.toObject();
    delete safe.password;
    delete safe.otp;
    delete safe.otpExpiry;
    res.json({ success: true, user: safe });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Change user password
// @route   PUT /api/account/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await findAccountById(req.user._id);

    if (user && user.password && (await bcrypt.compare(currentPassword, user.password))) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.json({ success: true, message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Invalid current password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- ADDRESS APIs ---

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id });
    res.json({ success: true, addresses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addAddress = async (req, res) => {
  try {
    const { fullName, phone, street, landmark, city, state, pincode, country, addressType, isDefault } = req.body;
    
    if(isDefault) {
        await Address.updateMany({ userId: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      userId: req.user._id,
      fullName, phone, street, landmark, city, state, pincode, country, addressType, isDefault
    });
    res.status(201).json({ success: true, address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- ORDERS APIs ---

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find(orderScopeFilter(req.user._id)).sort("-createdAt");
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- WISHLIST APIs ---

const getMyWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user._id }).populate("productId");
    res.json({ success: true, wishlist: items.map(i => i.productId) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- COMPLAINTS API ---
const submitComplaint = async (req, res) => {
  try {
    const { subject, message, fromRole } = req.body;
    const complaint = await Complaint.create({
      userId: req.user._id,
      fromRole: fromRole || "buyer",
      subject,
      message
    });
    res.status(201).json({ success: true, complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- DASHBOARD STATS ---
const getDashboardStats = async (req, res) => {
  try {
    const uid = req.user._id;
    const orderFilter = orderScopeFilter(uid);

    const totalOrders = await Order.countDocuments(orderFilter);
    const inTransitOrders = await Order.countDocuments({
      ...orderFilter,
      orderStatus: { $in: ["Shipped", "Confirmed", "Processing"] },
    });
    const wishlistCount = await Wishlist.countDocuments({ userId: uid });
    const addressCount = await Address.countDocuments({ userId: uid });

    const lastOrder = await Order.findOne(orderFilter).sort("-createdAt");

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders: inTransitOrders,
        inTransitOrders,
        wishlistCount,
        addressCount,
        savedAddresses: addressCount,
        lastOrder,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  getMyOrders,
  getMyWishlist,
  submitComplaint,
  getDashboardStats
};
