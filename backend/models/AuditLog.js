const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    action: { type: String, required: true },
    targetModel: { type: String },
    targetId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
