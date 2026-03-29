/**
 * Upserts marketplace category names (exact spelling for case-sensitive API filters).
 * Run: node scripts/seedMarketplaceCategories.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");

const NAMES = ["Fashion", "Jewelry", "Handmade", "Home Decor", "Crafts"];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  for (const name of NAMES) {
    await Category.findOneAndUpdate(
      { name },
      { $set: { name, isActive: true } },
      { upsert: true, new: true }
    );
    console.log("Category OK:", name);
  }

  console.log("Done seeding marketplace categories.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
