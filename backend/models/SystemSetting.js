const mongoose = require("mongoose");

const systemSettingSchema = new mongoose.Schema(
  {
    platformName: { type: String, default: "Handora" },
    tagline: { type: String, default: "Hand Made Haven" },
    adminEmail: { type: String, default: "artisanswomen@gmail.com" },
    supportEmail: { type: String, default: "support@handora.com" },
    maintenanceMode: { type: Boolean, default: false },
    autoApproval: { type: Boolean, default: false }, // for seller registration
    otpServiceStatus: { type: Boolean, default: true },
    sessionTimeout: { type: Number, default: 60 } // minutes
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemSetting", systemSettingSchema);
