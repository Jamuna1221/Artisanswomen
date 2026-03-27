const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

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

    // Check if it's an admin token (admin tokens include role: "admin")
    if (decoded.role === "admin") {
      req.admin = await Admin.findById(decoded.id).select("-password -otp -otpExpires");
      if (!req.admin) {
        return res.status(401).json({ message: "Admin not found" });
      }
      return next();
    }

    // Otherwise it's a seller/user token
    req.user = await User.findById(decoded.id).select("-password -otp -otpExpiry");
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

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
    const user = await User.findById(decoded.id).select("-password -otp -otpExpiry");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.verificationStatus !== "Approved") {
      return res.status(403).json({
        message: "Your account is not yet approved. Please wait for admin approval.",
        verificationStatus: user.verificationStatus,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

module.exports = { protect, protectSeller };
