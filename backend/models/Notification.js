const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientType: {
      type: String,
      enum: ["admin", "seller", "buyer"],
      required: true
    },
    recipientId: { type: mongoose.Schema.Types.ObjectId }, // null if broadcast to all admins
    senderType: {
      type: String,
      enum: ["system", "admin", "seller"],
      default: "system"
    },
    senderId: { type: mongoose.Schema.Types.ObjectId }, // optional
    title: { type: String, required: true },
    message: { type: String, required: true },
    notificationType: {
      type: String,
      default: "info" // info, warning, approval, rejection, reminder, new_registration
    },
    priority: {
      type: String,
      enum: ["normal", "important", "urgent"],
      default: "normal"
    },
    relatedSellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },

    // Legacy fields for backward compatibility
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    type: { type: String }, // Legacy
    details: { type: Object }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
