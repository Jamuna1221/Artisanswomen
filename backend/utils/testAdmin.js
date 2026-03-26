const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");
const path = require("path");
const bcrypt = require("bcryptjs");

dotenv.config({ path: path.join(__dirname, "../.env") });

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    const email = "artisanswomen@gmail.com";
    const pass = "Artisanswomen@2026";

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log("Admin NOT found!");
    } else {
      console.log("Admin found:", admin.email);
      const isMatch = await bcrypt.compare(pass, admin.password);
      console.log("Password Match:", isMatch);
    }
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

testLogin();
