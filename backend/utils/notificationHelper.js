const Notification = require("../models/Notification");
const Admin = require("../models/Admin");

const createAdminNotification = async (type, message, details = {}) => {
  try {
    // Find first admin (assuming one super admin for now, or broadcast to all)
    const admins = await Admin.find({ role: "admin" }).select("_id");
    
    const notifications = admins.map(admin => ({
      adminId: admin._id,
      type,
      message,
      details,
      timestamp: new Date()
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }
    console.log(`Notification Created: [${type}] ${message}`);
  } catch (err) {
    console.error("Error creating notification:", err.message);
  }
};

module.exports = { createAdminNotification };
