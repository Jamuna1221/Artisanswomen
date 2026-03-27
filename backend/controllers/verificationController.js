const VerificationRequest = require("../models/VerificationRequest");
const ArtisanProfile = require("../models/ArtisanProfile");
const User = require("../models/User");
const { createAdminNotification } = require("../utils/notificationHelper");

const getVerifications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const total = await VerificationRequest.countDocuments(filter);
    const verifications = await VerificationRequest.find(filter)
      .populate("artisanId", "name email createdAt")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ verifications, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getVerificationById = async (req, res) => {
  try {
    const v = await VerificationRequest.findById(req.params.id)
      .populate("artisanId", "name email phone createdAt")
      .populate("reviewedBy", "name email");
    if (!v) return res.status(404).json({ message: "Verification request not found" });
    res.json(v);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateVerificationStatus = async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const v = await VerificationRequest.findById(req.params.id);
    if (!v) return res.status(404).json({ message: "Verification request not found" });

    v.status = status;
    v.adminRemarks = adminRemarks || v.adminRemarks;
    v.reviewedBy = req.admin._id;
    v.reviewedAt = new Date();
    await v.save();

    // Sync artisan profile
    await ArtisanProfile.findOneAndUpdate(
      { userId: v.artisanId },
      {
        verificationStatus: status,
        isVerified: status === "Verified",
      }
    );

    // Notify admin
    await createAdminNotification("Seller", `Seller verification request ${status}`, {
      artisanId: v.artisanId,
      reviewedBy: req.admin.name
    });

    res.json({ message: `Verification ${status}`, verification: v });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getVerifications, getVerificationById, updateVerificationStatus };
