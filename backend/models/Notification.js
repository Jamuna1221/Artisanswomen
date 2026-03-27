const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    type: { 
      type: String, 
      enum: ["User", "Seller", "Complaint", "Product", "Security", "System"],
      required: true 
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    details: { type: Object },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
