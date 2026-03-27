const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");
const SystemSetting = require("../models/SystemSetting");
const { sendOtpEmail } = require("../utils/mail");

const generateToken = (id) => {
  return jwt.sign({ id, role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// STEP 1: Verify Email & Password, Send OTP
exports.login = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();
  console.log("LOGIN_DEBUG: Attempting login for", email);

  try {
    const admin = await Admin.findOne({ email });
    console.log("LOGIN_DEBUG: Admin found?", !!admin);

    if (admin && (await admin.matchPassword(password))) {
      console.log("LOGIN_DEBUG: Password Match SUCCESS");
      // Generate 6-digit OTP
      const otp = generateOTP();
      console.log("LOGIN_DEBUG: Generated OTP for " + admin.email + ": " + otp);
      const expiryMinutes = parseInt(process.env.OTP_EXPIRY || 10);
      
      admin.otp = otp;
      admin.otpExpires = new Date(Date.now() + expiryMinutes * 60 * 1000);
      await admin.save();

      // Send OTP Email
      const emailSent = await sendOtpEmail(admin.email, otp);

      if (emailSent) {
        return res.status(200).json({
          message: "OTP sent to your registered email.",
          requiresOTP: true,
          email: admin.email
        });
      } else {
        return res.status(500).json({ message: "Error sending verification email." });
      }
    } else {
      res.status(401).json({ message: "Unauthorized. Invalid credentials." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// STEP 2: Verify OTP & Issue Full Token
exports.verifyOTP = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const { otp } = req.body;

  try {
    const admin = await Admin.findOne({ 
      email, 
      otp, 
      otpExpires: { $gt: Date.now() } 
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid or expired verification code." });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Log the session activity
    await AuditLog.create({
      adminId: admin._id,
      action: "Admin Login",
      details: `Successful login from ${req.headers['user-agent'] || 'Unknown Device'}`,
      ipAddress: req.ip
    });

    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
      token: generateToken(admin._id),
      message: "Security verification successful."
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// STEP 3: Resend OTP
exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found." });

    const otp = generateOTP();
    admin.otp = otp;
    admin.otpExpires = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY) || 10) * 60 * 1000);
    await admin.save();

    const emailSent = await sendOtpEmail(admin.email, otp);

    if (emailSent) {
      res.status(200).json({ message: "A new security code has been sent." });
    } else {
      res.status(500).json({ message: "Error sending security code." });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Profile Access
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password -otp -otpExpires");
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: "Admin profile not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.name = req.body.name || admin.name;
    admin.email = req.body.email || admin.email;
    if (req.body.password) {
      admin.password = req.body.password;
    }
    admin.profileImage = req.body.profileImage || admin.profileImage;

    const updatedAdmin = await admin.save();

    // Log update activity
    await AuditLog.create({
      adminId: admin._id,
      action: "Profile Update",
      details: "Admin updated profile details",
      ipAddress: req.ip
    });

    res.json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
      profileImage: updatedAdmin.profileImage,
      message: "Profile updated successfully"
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Activity Log
exports.getActivity = async (req, res) => {
  try {
    const logs = await AuditLog.find({ adminId: req.admin._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);

    if (admin && (await admin.matchPassword(oldPassword))) {
      admin.password = newPassword;
      await admin.save();

      await AuditLog.create({
        adminId: admin._id,
        action: "Password Change",
        details: "Admin updated account password",
        ipAddress: req.ip
      });

      res.json({ message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Invalid old password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ adminId: req.admin._id })
      .sort({ createdAt: -1 })
      .limit(50);
    const unreadCount = await Notification.countDocuments({ adminId: req.admin._id, isRead: false });
    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ adminId: req.admin._id, isRead: false }, { isRead: true });
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// System Settings
exports.getSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = await SystemSetting.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSetting.findOne();
    if (!settings) {
      settings = new SystemSetting(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
