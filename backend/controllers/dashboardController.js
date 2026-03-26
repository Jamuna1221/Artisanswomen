const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Complaint = require("../models/Complaint");
const VerificationRequest = require("../models/VerificationRequest");

// @desc   Get dashboard summary stats
// @route  GET /api/admin/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalArtisans = await User.countDocuments({ role: "artisan" });
    const verifiedArtisans = await User.countDocuments({ role: "artisan", status: "active" });
    const totalBuyers = await User.countDocuments({ role: "buyer" });
    const pendingVerifications = await VerificationRequest.countDocuments({ status: "Pending" });
    const totalProducts = await Product.countDocuments();
    const pendingProducts = await Product.countDocuments({ status: "Pending Approval" });
    const totalOrders = await Order.countDocuments();
    const openComplaints = await Complaint.countDocuments({ status: "Open" });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      totalArtisans,
      verifiedArtisans,
      totalBuyers,
      pendingVerifications,
      totalProducts,
      pendingProducts,
      totalOrders,
      openComplaints,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc   Get recent activities
// @route  GET /api/admin/dashboard/recent
const getRecentActivities = async (req, res) => {
  try {
    const recentVerifications = await VerificationRequest.find()
      .populate("artisanId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentOrders = await Order.find()
      .populate("buyerId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentComplaints = await Complaint.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ recentVerifications, recentOrders, recentComplaints });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDashboardStats, getRecentActivities };
