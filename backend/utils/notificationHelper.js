const Notification = require("../models/Notification");
const Admin = require("../models/Admin");

const createAdminNotification = async (type, message, details = {}) => {
  try {
    // Find first admin (assuming one super admin for now, or broadcast to all)
    const admins = await Admin.find({ role: "admin" }).select("_id");

    const notifications = admins.map(admin => ({
      recipientType: "admin",
      recipientId: admin._id,
      title: type,
      message,
      notificationType: "info",
      adminId: admin._id, // Legacy compatibility
      type, // Legacy compatibility
      details,
      timestamp: new Date()
    }));

    if (notifications.length > 0) {
      const inserted = await Notification.insertMany(notifications);
      // Emit to all connected sockets
      try {
        const { getIO } = require("../config/socket");
        const io = getIO();
        inserted.forEach(noti => {
          io.emit("new-notification", noti);
        });
      } catch (ioErr) {
        console.error("Socket error (maybe not initialized):", ioErr.message);
      }
    }
    console.log(`Notification Created: [${type}] ${message}`);
  } catch (err) {
    console.error("Error creating notification:", err.message);
  }
};

const createSellerNotification = async (sellerId, title, message, notificationType = 'info', priority = 'normal', senderId = null) => {
  try {
    const noti = await Notification.create({
      recipientType: "seller",
      recipientId: sellerId,
      senderType: senderId ? "admin" : "system",
      senderId,
      title,
      message,
      notificationType,
      priority,
      relatedSellerId: sellerId
    });

    try {
      const { getIO } = require("../config/socket");
      getIO().to(`seller_${sellerId}`).emit("new-notification", noti);
    } catch (err) {
      console.log("No active socket for seller or not initialized");
    }
    return noti;
  } catch (err) {
    console.error("Error creating seller notif:", err.message);
  }
};

module.exports = { createAdminNotification, createSellerNotification };
