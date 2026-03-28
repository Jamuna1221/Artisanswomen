const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendOtpEmail, sendApprovalEmail, sendRejectionEmail } = require("../utils/sendEmail");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const ArtisanProfile = require("../models/ArtisanProfile");
const VerificationRequest = require("../models/VerificationRequest");
const { createAdminNotification } = require("../utils/notificationHelper");

// ─── Helper ─────────────────────────────────────────────────────────────────
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ─── POST /api/auth/send-otp ─────────────────────────────────────────────────
// Signup step 1: send OTP to email
router.post("/send-otp", async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name)
      return res.status(400).json({ message: "Email and name are required" });

    const otp = generateOtp();
    const otpExpiry = new Date(
      Date.now() + (parseInt(process.env.OTP_EXPIRY) || 10) * 60 * 1000
    );

    // Upsert: create user with name+email if not exists, update OTP if exists
    let user = await User.findOne({ email });
    if (user && user.verificationStatus !== "Pending" && user.isOtpVerified) {
      // Already registered seller — don't allow re-registration
      return res.status(400).json({
        message: "An account with this email already exists. Please login.",
      });
    }

    if (!user) {
      user = new User({ name, email, otp, otpExpiry, isOtpVerified: false });
    } else {
      user.name = name;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.isOtpVerified = false;
    }
    await user.save();

    await sendOtpEmail(email, name, otp);

    res.json({ message: "OTP sent to your email successfully" });
  } catch (err) {
    console.error("send-otp error:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

// ─── POST /api/auth/verify-otp ───────────────────────────────────────────────
// Signup step 2: verify OTP → return tempToken
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiry < new Date())
      return res.status(400).json({ message: "OTP has expired" });

    user.isOtpVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Short-lived token (15 min) to protect the registration form submission
    const tempToken = generateToken(user._id, "15m");

    res.json({
      message: "OTP verified successfully",
      tempToken,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("verify-otp error:", err);
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
});

// ─── POST /api/auth/register ─────────────────────────────────────────────────
// Signup step 3: full registration form (multipart/form-data)
// Protected by tempToken from verify-otp
router.post(
  "/register",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "artisanCardFile", maxCount: 1 },
    { name: "idProofFile", maxCount: 1 },
    { name: "businessProofFile", maxCount: 1 },
    { name: "addressProofFile", maxCount: 1 },
    { name: "productImages", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const user = req.user;

      if (!user.isOtpVerified) {
        return res.status(403).json({ message: "OTP not verified" });
      }

      const {
        age,
        gender,
        aadhaarNumber,
        phone,
        craftType,
        experience,
        bio,
        city,
        district,
        state,
        whatsapp,
        instagram,
        hasPehchanCard,
        idProofType,
        password,
      } = req.body;

      // Validate password
      if (!password || password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Parse craftType (sent as JSON string or comma-separated from form)
      let parsedCraftType = craftType;
      if (typeof craftType === "string") {
        try {
          parsedCraftType = JSON.parse(craftType);
        } catch {
          parsedCraftType = craftType.split(",").map((c) => c.trim());
        }
      }

      // Update user fields
      user.password = hashedPassword;
      user.age = age;
      user.gender = gender;
      user.aadhaarNumber = aadhaarNumber;
      user.phone = phone;
      user.craftType = parsedCraftType;
      user.experience = experience;
      user.bio = bio;
      user.city = city;
      user.district = district;
      user.state = state;
      user.socialLinks = { whatsapp, instagram };
      user.verificationStatus = "Pending";

      // Handle file uploads → store as Buffer in MongoDB
      if (req.files?.profileImage) {
        user.profileImage = {
          data: req.files.profileImage[0].buffer,
          contentType: req.files.profileImage[0].mimetype,
        };
      }

      if (req.files?.artisanCardFile) {
        user.artisanCardFile = {
          data: req.files.artisanCardFile[0].buffer,
          contentType: req.files.artisanCardFile[0].mimetype,
          hasPehchanCard: true,
        };
      } else {
        user.artisanCardFile = {
          hasPehchanCard: hasPehchanCard === "true" || hasPehchanCard === true,
        };
      }

      if (req.files?.idProofFile) {
        user.idProofFile = {
          data: req.files.idProofFile[0].buffer,
          contentType: req.files.idProofFile[0].mimetype,
          idProofType,
        };
      }

      if (req.files?.businessProofFile) {
        user.businessProofFile = {
          data: req.files.businessProofFile[0].buffer,
          contentType: req.files.businessProofFile[0].mimetype,
        };
      }

      if (req.files?.addressProofFile) {
        user.addressProofFile = {
          data: req.files.addressProofFile[0].buffer,
          contentType: req.files.addressProofFile[0].mimetype,
        };
      }

      if (req.files?.productImages && req.files.productImages.length > 0) {
        user.productImages = req.files.productImages.map(file => ({
          data: file.buffer,
          contentType: file.mimetype,
        }));
      }

      await user.save();

      // Create Artisan Profile to sync data
      const artisanProfile = new ArtisanProfile({
        userId: user._id,
        phone: phone,
        location: `${city}, ${district}, ${state}`,
        craftType: parsedCraftType.join(", "),
        experience: experience,
        bio: bio,
        isVerified: false,
        verificationStatus: "Pending"
      });
      await artisanProfile.save();

      // Create Verification Request
      const vr = new VerificationRequest({
        artisanId: user._id,
        status: "Pending"
      });
      await vr.save();

      // Notify Admins
      if (typeof createAdminNotification === 'function') {
        try {
          await createAdminNotification("Seller", `New seller registration received from ${user.name}`, {
            sellerName: user.name,
            email: user.email,
            phone: user.phone,
            craftType: parsedCraftType.join(", "),
            createdAt: user.createdAt || new Date(),
            status: "Pending",
            artisanId: user._id
          });
        } catch (notifErr) {
          console.error("Failed to create admin notification:", notifErr);
        }
      }

      // Issue a long-lived auth token
      const authToken = generateToken(user._id, "7d");

      res.status(201).json({
        message: "Registration submitted successfully! Awaiting admin approval.",
        authToken,
        verificationStatus: user.verificationStatus,
        name: user.name,
        email: user.email,
      });
    } catch (err) {
      console.error("register error:", err);
      res.status(500).json({ message: "Registration failed", error: err.message });
    }
  }
);

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
// Email + Password login for registered (but pending/approved) sellers
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    if (user.role === 'seller' && user.verificationStatus !== 'Approved') {
      return res.status(403).json({ message: "Your account is pending admin approval or has been rejected. You cannot log in yet." });
    }

    const token = generateToken(user._id, "7d");

    res.json({
      message: "Login successful",
      token,
      verificationStatus: user.verificationStatus,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// ─── GET /api/auth/status ─────────────────────────────────────────────────────
// Get current seller's verification status (JWT protected)
router.get("/status", protect, async (req, res) => {
  try {
    const { name, email, verificationStatus, rejectionReason, createdAt } =
      req.user;
    res.json({ name, email, verificationStatus, rejectionReason, createdAt });
  } catch (err) {
    res.status(500).json({ message: "Failed to get status", error: err.message });
  }
});

// ─── POST /api/auth/admin/approve ─────────────────────────────────────────────
// Called by admin to approve/reject (sends email to artisan)
// NOTE: Protect with admin role check in your admin routes — this is a helper
router.post("/admin/approve", async (req, res) => {
  try {
    const { userId, action, reason } = req.body; // action: "approve" | "reject"
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (action === "approve") {
      user.verificationStatus = "Approved";
      user.isVerified = true;
      await user.save();
      await sendApprovalEmail(user.email, user.name);
      res.json({ message: "Seller approved and notified by email" });
    } else if (action === "reject") {
      user.verificationStatus = "Rejected";
      user.rejectionReason = reason || "";
      await user.save();
      await sendRejectionEmail(user.email, user.name, reason);
      res.json({ message: "Seller rejected and notified by email" });
    } else {
      res.status(400).json({ message: "Invalid action. Use 'approve' or 'reject'" });
    }
  } catch (err) {
    console.error("admin/approve error:", err);
    res.status(500).json({ message: "Failed to process action", error: err.message });
  }
});

// ─── GET /api/auth/document/:userId/:docType ──────────────────────────────
// Serve individual document buffers as files
router.get("/document/:userId/:docType", async (req, res) => {
  try {
    const { userId, docType } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let doc;
    if (docType === "profileImage") doc = user.profileImage;
    else if (docType === "artisanCard") doc = user.artisanCardFile;
    else if (docType === "idProof") doc = user.idProofFile;
    else if (docType === "businessProof") doc = user.businessProofFile;
    else if (docType === "addressProof") doc = user.addressProofFile;
    else if (docType.startsWith("productImage_")) {
      const idx = parseInt(docType.split("_")[1]);
      doc = user.productImages[idx];
    }

    if (!doc || !doc.data) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.set("Content-Type", doc.contentType);
    res.send(doc.data);
  } catch (err) {
    console.error("document error:", err);
    res.status(500).json({ message: "Failed to fetch document", error: err.message });
  }
});

module.exports = router;
