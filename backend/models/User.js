const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // --- Identity ---
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["seller", "buyer", "admin"], default: "seller" },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // set during registration
    age: { type: Number },
    gender: { type: String, enum: ["Women", "Transwomen"] },
    aadhaarNumber: { type: String },
    phone: { type: String },

    // --- Craft ---
    craftType: [{ type: String }], // e.g. ["Pottery", "Weaving", "Other: Macramé"]
    experience: { type: String },
    bio: { type: String },

    // --- Location ---
    city: { type: String },
    district: { type: String },
    state: { type: String },

    // --- Social ---
    socialLinks: {
      whatsapp: { type: String },
      instagram: { type: String },
    },

    // --- Files stored as Buffer in MongoDB ---
    profileImage: {
      data: { type: Buffer },
      contentType: { type: String },
    },
    artisanCardFile: {
      data: { type: Buffer },
      contentType: { type: String },
      hasPehchanCard: { type: Boolean, default: false },
    },
    idProofFile: {
      data: { type: Buffer },
      contentType: { type: String },
      idProofType: { type: String }, // e.g. "Aadhaar", "PAN", "Passport", etc.
    },
    businessProofFile: {
      data: { type: Buffer },
      contentType: { type: String },
    },
    addressProofFile: {
      data: { type: Buffer },
      contentType: { type: String },
    },
    productImages: [
      {
        data: { type: Buffer },
        contentType: { type: String },
      }
    ],

    // --- Verification ---
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: { type: String },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    approvalEmailSent: { type: Boolean, default: false },

    // --- OTP (for signup only) ---
    otp: { type: String },
    otpExpiry: { type: Date },
    isOtpVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
