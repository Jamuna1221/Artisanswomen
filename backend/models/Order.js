const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  title: String,
  price: Number,
  quantity: Number,
  image: String,
  selectedSize: String,
  selectedColor: String,
});

const orderSchema = new mongoose.Schema(
  {
    /** @deprecated use userId — kept for backward compatibility */
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    /** Preferred owner reference (same id as buyer for marketplace orders) */
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    /** Line items (API alias: `products`) */
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
    /** Simplified status for basic integrations: pending | shipped | delivered */
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
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

orderSchema.virtual("products").get(function () {
  return this.items;
});

orderSchema.pre("validate", function (next) {
  if (!this.buyerId && !this.userId) {
    return next(new Error("Order requires buyerId or userId"));
  }
  if (!this.userId && this.buyerId) this.userId = this.buyerId;
  if (!this.buyerId && this.userId) this.buyerId = this.userId;
  next();
});

orderSchema.pre("save", function () {
  const os = this.orderStatus;
  if (os === "Delivered") {
    this.status = "delivered";
  } else if (os === "Shipped") {
    this.status = "shipped";
  } else {
    this.status = "pending";
  }
});

orderSchema.set("toJSON", { virtuals: true });
orderSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Order", orderSchema);
