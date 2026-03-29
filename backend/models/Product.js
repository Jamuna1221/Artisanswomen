const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Core info
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    fullDescription: { type: String, trim: true },
    sku: { type: String, unique: true, sparse: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subcategory: { type: String, trim: true },
    tags: [String],

    // Pricing & inventory
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    
    // Variants & Logistics
    colors: [String],
    sizes: [String],
    deliveryEstimate: { type: String, default: "3-5 business days" },
    specifications: { type: Map, of: String },

    // Images — Cloudinary URLs
    images: [String],

    // Status
    status: {
      type: String,
      enum: ["Active", "Draft", "Out of Stock", "Pending Approval", "Rejected", "Removed"],
      default: "Draft",
    },
    rejectionReason: { type: String },

    // Visibility toggle (seller can hide from marketplace)
    isVisible: { type: Boolean, default: true },

    // Featured / trending
    isFeatured: { type: Boolean, default: false },

    // Sales analytics
    soldCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },

    // Rating (aggregated)
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate SKU before save if not set
productSchema.pre("save", async function () {
  if (!this.sku) {
    this.sku = "AW-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substring(2, 5).toUpperCase();
  }
  // Auto set Out of Stock status
  if (this.stock === 0 && this.status === "Active") {
    this.status = "Out of Stock";
  }
});

// Virtual: revenue
productSchema.virtual("revenue").get(function () {
  return this.soldCount * this.price;
});

// Virtual: conversionRate
productSchema.virtual("conversionRate").get(function () {
  if (!this.viewCount) return 0;
  return ((this.soldCount / this.viewCount) * 100).toFixed(1);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
