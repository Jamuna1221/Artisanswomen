const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const Buyer = require("../models/buyerModel");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's an admin token
    if (decoded.role === "admin") {
      req.admin = await Admin.findById(decoded.id).select("-password -otp -otpExpires");
      if (!req.admin) {
        return res.status(401).json({ message: "Admin not found" });
      }
      return next();
    }

    // Attempt to find in User collection (Sellers and Unified Buyers)
    let user = await User.findById(decoded.id).select("-password -otp -otpExpiry");
    
    // Fallback to legacy Buyers collection if not found
    if (!user) {
      user = await Buyer.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

/** Alias for JWT-protected buyer/seller routes (same behavior as `protect`) */
const verifyToken = protect;

/**
 * Middleware: allow only approved sellers to access seller-dashboard APIs
 */
const protectSeller = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Primary lookup
    let user = await User.findById(decoded.id).select("-password -otp -otpExpiry");
    
    // Legacy lookup
    if(!user) {
        user = await Buyer.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Only sellers need verificationStatus check
    if (user.role === 'seller' && user.verificationStatus !== "Approved") {
      return res.status(403).json({
        message: "Your account is not yet approved. Please wait for admin approval.",
        verificationStatus: user.verificationStatus,
      });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

module.exports = { protect, protectSeller, verifyToken };
