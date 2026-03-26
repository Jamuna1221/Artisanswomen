const mongoose = require("mongoose");

const verificationRequestSchema = new mongoose.Schema(
  {
    artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    submittedDocuments: {
      artisanCard: { type: String },
      idProof: { type: String },
      additionalDocs: [String],
    },
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Verified", "Rejected", "Resubmission Required"],
      default: "Pending",
    },
    adminRemarks: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VerificationRequest", verificationRequestSchema);
