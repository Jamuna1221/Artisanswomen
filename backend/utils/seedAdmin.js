const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding...");

    // Clear old ones
    await Admin.deleteMany({});

    // Create the specifically typed one from your login attempts
    const admin = new Admin({
      name: "Handora Super Admin",
      email: "artisanswomens@gmail.com",
      password: "Artisanswomen@2026", 
      role: "admin",
    });

    await admin.save();
    console.log("Handora Admin created successfully! ✅");
    console.log("Email: artisanswomens@gmail.com");
    console.log("Password: Artisanswomen@2026");

    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();
