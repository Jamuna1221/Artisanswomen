const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
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

    // Clear OTP after successful verification
    admin.otp = undefined;
    admin.otpExpires = undefined;
    await admin.save();

    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
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
  const admin = await Admin.findById(req.admin._id).select("-password -otp -otpExpires");
  if (admin) {
    res.json(admin);
  } else {
    res.status(404).json({ message: "Admin profile not found" });
  }
};
