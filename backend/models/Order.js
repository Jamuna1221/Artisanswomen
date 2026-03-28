const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  title: String,
  price: Number,
  quantity: Number,
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Confirmed", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Processing",
    },
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      phone: String,
    },
    estimatedDeliveryDate: { type: Date },
    paymentMethod: { type: String, default: "COD" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
