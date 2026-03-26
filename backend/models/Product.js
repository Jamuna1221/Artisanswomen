const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [String],
    status: {
      type: String,
      enum: ["Pending Approval", "Active", "Rejected", "Removed", "Out of Stock"],
      default: "Pending Approval",
    },
    rejectionReason: { type: String },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
