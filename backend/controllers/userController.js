const User = require("../models/User");
const ArtisanProfile = require("../models/ArtisanProfile");
const { sendApprovalEmail, sendRejectionEmail } = require("../utils/sendEmail");
const { createSellerNotification } = require("../utils/notificationHelper");

const getArtisans = async (req, res) => {
  try {
    const { status, verificationStatus, search, page = 1, limit = 10 } = req.query;
    const filter = { role: "seller" };
    if (status) filter.status = status;
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];

    const total = await User.countDocuments(filter);
    const artisans = await User.find(filter)
      .select("-password -profileImage.data -idProofFile.data -artisanCardFile.data -businessProofFile.data -addressProofFile.data -productImages.data")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const artisanIds = artisans.map((a) => a._id);
    const profiles = await ArtisanProfile.find({ userId: { $in: artisanIds } });
    const profileMap = {};
    profiles.forEach((p) => (profileMap[p.userId.toString()] = p));

    const data = artisans.map((a) => ({
      ...a.toObject(),
      profile: profileMap[a._id.toString()] || null,
    }));

    res.json({ artisans: data, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getBuyers = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const filter = { role: "buyer" };
    if (status) filter.status = status;
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];

    const total = await User.countDocuments(filter);
    const buyers = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ buyers, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `User status updated to ${status}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    const profile = await ArtisanProfile.findOne({ userId: req.params.id });
    res.json({ user, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const approveSeller = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.verificationStatus = "Approved";
    user.isVerified = true;
    user.approvedAt = new Date();
    user.status = "active"; // Ensure active status

    // Send email
    try {
      await sendApprovalEmail(user.email, user.name);
      user.approvalEmailSent = true;
    } catch (emailErr) {
      console.error("Failed to send approval email:", emailErr);
      user.approvalEmailSent = false;
    }

    await user.save();

    // Sync profile if exists
    await ArtisanProfile.findOneAndUpdate(
      { userId: user._id },
      { verificationStatus: "Verified", isVerified: true }
    );

    await createSellerNotification(user._id, "Application Approved", "Congratulations! Your artisan account has been approved. You now have full access to your Seller Dashboard.", "approval", "important");

    res.json({ message: "Seller approved successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const rejectSeller = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.verificationStatus = "Rejected";
    user.isVerified = false;
    user.rejectionReason = reason || "Does not meet our criteria for a seller account.";
    user.rejectedAt = new Date();

    // Send email
    try {
      await sendRejectionEmail(user.email, user.name, user.rejectionReason);
    } catch (emailErr) {
      console.error("Failed to send rejection email:", emailErr);
    }

    await user.save();

    // Sync profile if exists
    await ArtisanProfile.findOneAndUpdate(
      { userId: user._id },
      { verificationStatus: "Rejected", isVerified: false }
    );

    await createSellerNotification(user._id, "Application Rejected", user.rejectionReason, "rejection", "important");

    res.json({ message: "Seller rejected successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getArtisans, getBuyers, updateUserStatus, getUserById, approveSeller, rejectSeller };
