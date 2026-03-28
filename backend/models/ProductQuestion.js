const mongoose = require("mongoose");

const productQuestionSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    askerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: String, required: true, trim: true, maxlength: 500 },
    answer: { type: String, trim: true, maxlength: 1000 },
    answeredAt: { type: Date },
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // seller
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductQuestion", productQuestionSchema);
