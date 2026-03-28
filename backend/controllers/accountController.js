const User = require("../models/User");
const Order = require("../models/Order");
const Address = require("../models/Address");
const Wishlist = require("../models/Wishlist");
const Cart = require("../models/Cart");
const Complaint = require("../models/Complaint");
const bcrypt = require("bcryptjs");

// @desc    Get current user profile
// @route   GET /api/account/me
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/account/me
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, gender, bio, city, state } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.name = `${user.firstName} ${user.lastName}`.trim();
      user.phone = phone || user.phone;
      user.gender = gender || user.gender;
      user.bio = bio || user.bio;
      user.city = city || user.city;
      user.state = state || user.state;

      const updatedUser = await user.save();
      res.json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
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
    const user = await User.findById(req.user._id);

    if (user && (await bcrypt.compare(currentPassword, user.password))) {
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
    const orders = await Order.find({ buyerId: req.user._id }).sort("-createdAt");
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
    const totalOrders = await Order.countDocuments({ buyerId: req.user._id });
    const pendingOrders = await Order.countDocuments({ buyerId: req.user._id, orderStatus: { $ne: "Delivered" } });
    const wishlistCount = await Wishlist.countDocuments({ userId: req.user._id });
    const addressCount = await Address.countDocuments({ userId: req.user._id });
    
    const lastOrder = await Order.findOne({ buyerId: req.user._id }).sort("-createdAt");

    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        wishlistCount,
        addressCount,
        lastOrder
      }
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
