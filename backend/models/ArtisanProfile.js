const mongoose = require("mongoose");

const artisanProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    phone: { type: String },
    location: { type: String },
    craftType: { type: String },
    experience: { type: String },
    bio: { type: String },
    profileImage: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ["Not Submitted", "Pending", "Under Review", "Verified", "Rejected", "Resubmission Required"],
      default: "Not Submitted",
    },
    artisanCardFile: { type: String },
    idProofFile: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ArtisanProfile", artisanProfileSchema);
