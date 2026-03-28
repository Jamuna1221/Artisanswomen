const Product = require("../models/Product");
const Review = require("../models/Review");
const ProductQuestion = require("../models/ProductQuestion");
const Complaint = require("../models/Complaint");
const { cloudinary } = require("../config/cloudinary");

// ─────────────────────────────────────────────────
// GET /api/seller/products
// List seller's own products with filters & pagination
// ─────────────────────────────────────────────────
const getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const {
      status,
      category,
      search,
      featured,
      page = 1,
      limit = 20,
      sort = "newest",
    } = req.query;

    const filter = { artisanId: sellerId };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (featured === "true") filter.isFeatured = true;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_high: { price: -1 },
      price_low: { price: 1 },
      stock_low: { stock: 1 },
      top_selling: { soldCount: -1 },
      top_rated: { rating: -1 },
    };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("category", "name")
      .sort(sortMap[sort] || sortMap.newest)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean({ virtuals: true });

    // Summary stats for the seller
    const allProducts = await Product.find({ artisanId: sellerId }).lean({ virtuals: true });
    const stats = {
      total: allProducts.length,
      active: allProducts.filter((p) => p.status === "Active").length,
      draft: allProducts.filter((p) => p.status === "Draft").length,
      outOfStock: allProducts.filter((p) => p.status === "Out of Stock").length,
      lowStock: allProducts.filter((p) => p.stock > 0 && p.stock < 5).length,
      totalRevenue: allProducts.reduce((sum, p) => sum + p.soldCount * p.price, 0),
      avgRating:
        allProducts.filter((p) => p.ratingCount > 0).length > 0
          ? (
              allProducts
                .filter((p) => p.ratingCount > 0)
                .reduce((sum, p) => sum + p.rating, 0) /
              allProducts.filter((p) => p.ratingCount > 0).length
            ).toFixed(1)
          : 0,
    };

    res.json({
      products,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// POST /api/seller/products
// Create a new product (images uploaded via Cloudinary middleware)
// ─────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { title, description, category, price, stock, tags, status } = req.body;

    let categoryObjId = undefined;
    if (category) {
      const mongoose = require("mongoose");
      if (mongoose.Types.ObjectId.isValid(category)) {
        categoryObjId = category;
      } else {
        const Category = require("../models/Category");
        let cat = await Category.findOne({ name: new RegExp(`^${category}$`, "i") });
        if (!cat) {
          cat = await Category.create({ name: category });
        }
        categoryObjId = cat._id;
      }
    }

    // Images come from Cloudinary via multer-storage-cloudinary
    const imageUrls = req.files ? req.files.map((f) => f.path) : [];

    const product = await Product.create({
      artisanId: sellerId,
      title,
      description,
      category: categoryObjId,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      images: imageUrls,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim())) : [],
      status: status || "Draft",
    });

    await product.populate("category", "name");
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// GET /api/seller/products/:id
// Get single product detail (seller must own it)
// ─────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      artisanId: req.user._id,
    })
      .populate("category", "name")
      .lean({ virtuals: true });

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// PUT /api/seller/products/:id
// Update product (supports partial image replacement)
// ─────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      artisanId: req.user._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { title, description, category, price, stock, tags, status, keepImages } = req.body;

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newUrls = req.files.map((f) => f.path);

      if (keepImages === "false") {
        // Delete old images from Cloudinary
        for (const url of product.images) {
          const publicId = url.split("/").slice(-2).join("/").replace(/\.[^.]+$/, "");
          await cloudinary.uploader.destroy(publicId).catch(() => {});
        }
        product.images = newUrls;
      } else {
        // Append new images
        product.images = [...(product.images || []), ...newUrls].slice(0, 10);
      }
    }

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (category !== undefined) {
      if (!category) {
        product.category = undefined;
      } else {
        const mongoose = require("mongoose");
        if (mongoose.Types.ObjectId.isValid(category)) {
          product.category = category;
        } else {
          const Category = require("../models/Category");
          let cat = await Category.findOne({ name: new RegExp(`^${category}$`, "i") });
          if (!cat) cat = await Category.create({ name: category });
          product.category = cat._id;
        }
      }
    }
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) {
      product.stock = parseInt(stock);
      // Auto status
      if (product.stock === 0 && product.status === "Active") {
        product.status = "Out of Stock";
      } else if (product.stock > 0 && product.status === "Out of Stock") {
        product.status = "Active";
      }
    }
    if (tags !== undefined) {
      product.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim());
    }
    if (status !== undefined) product.status = status;

    await product.save();
    await product.populate("category", "name");
    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// DELETE /api/seller/products/:id
// Delete product + Cloudinary images
// ─────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      artisanId: req.user._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete images from Cloudinary
    for (const url of product.images) {
      const publicId = url.split("/").slice(-2).join("/").replace(/\.[^.]+$/, "");
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// POST /api/seller/products/:id/duplicate
// ─────────────────────────────────────────────────
const duplicateProduct = async (req, res) => {
  try {
    const original = await Product.findOne({
      _id: req.params.id,
      artisanId: req.user._id,
    }).lean();
    if (!original) return res.status(404).json({ message: "Product not found" });

    const { _id, sku, createdAt, updatedAt, soldCount, viewCount, rating, ratingCount, ...data } = original;

    const copy = await Product.create({
      ...data,
      title: `${data.title} (Copy)`,
      status: "Draft",
      stock: 0,
      isVisible: false,
    });

    await copy.populate("category", "name");
    res.status(201).json({ message: "Product duplicated", product: copy });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// PATCH /api/seller/products/:id/visibility
// ─────────────────────────────────────────────────
const toggleVisibility = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      artisanId: req.user._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isVisible = !product.isVisible;
    await product.save();
    res.json({ isVisible: product.isVisible });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// PATCH /api/seller/products/:id/featured
// ─────────────────────────────────────────────────
const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      artisanId: req.user._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isFeatured = !product.isFeatured;
    await product.save();
    res.json({ isFeatured: product.isFeatured });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// PATCH /api/seller/products/:id/status
// Publish / Unpublish / Mark OOS
// ─────────────────────────────────────────────────
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["Active", "Draft", "Out of Stock"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, artisanId: req.user._id },
      { status },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: `Status updated to ${status}`, status: product.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// PATCH /api/seller/products/:id/inline
// Inline edit price or stock only
// ─────────────────────────────────────────────────
const inlineEdit = async (req, res) => {
  try {
    const { price, stock } = req.body;
    const product = await Product.findOne({
      _id: req.params.id,
      artisanId: req.user._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) {
      product.stock = parseInt(stock);
      if (product.stock === 0 && product.status === "Active") product.status = "Out of Stock";
      if (product.stock > 0 && product.status === "Out of Stock") product.status = "Active";
    }

    await product.save();
    res.json({ price: product.price, stock: product.stock, status: product.status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// DELETE /api/seller/products/:id/images/:imgIndex
// Remove a single image
// ─────────────────────────────────────────────────
const deleteImage = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      artisanId: req.user._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const idx = parseInt(req.params.imgIndex);
    const url = product.images[idx];
    if (!url) return res.status(404).json({ message: "Image not found" });

    const publicId = url.split("/").slice(-2).join("/").replace(/\.[^.]+$/, "");
    await cloudinary.uploader.destroy(publicId).catch(() => {});
    product.images.splice(idx, 1);
    await product.save();
    res.json({ message: "Image deleted", images: product.images });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// GET /api/seller/products/:id/reviews
// ─────────────────────────────────────────────────
const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      artisanId: req.user._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const reviews = await Review.find({ productId: req.params.id })
      .populate("buyerId", "name")
      .sort({ createdAt: -1 });

    // Rating breakdown
    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => { breakdown[r.rating] = (breakdown[r.rating] || 0) + 1; });

    res.json({ reviews, breakdown, total: reviews.length, avgRating: product.rating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// GET /api/seller/products/:id/questions
// ─────────────────────────────────────────────────
const getProductQuestions = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      artisanId: req.user._id,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const questions = await ProductQuestion.find({ productId: req.params.id })
      .populate("askerId", "name")
      .sort({ createdAt: -1 });

    res.json({ questions, total: questions.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// POST /api/seller/products/:id/questions/:qid/answer
// ─────────────────────────────────────────────────
const answerQuestion = async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer) return res.status(400).json({ message: "Answer is required" });

    const question = await ProductQuestion.findOneAndUpdate(
      { _id: req.params.qid, productId: req.params.id },
      { answer, answeredAt: new Date(), answeredBy: req.user._id },
      { new: true }
    ).populate("askerId", "name");

    if (!question) return res.status(404).json({ message: "Question not found" });
    res.json({ message: "Answer saved", question });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────
// GET /api/seller/products/:id/analytics
// ─────────────────────────────────────────────────
const getProductAnalytics = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      artisanId: req.user._id,
    }).lean({ virtuals: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const reviewCount = await Review.countDocuments({ productId: req.params.id });
    const questionCount = await ProductQuestion.countDocuments({ productId: req.params.id });
    const unanswered = await ProductQuestion.countDocuments({
      productId: req.params.id,
      answer: { $exists: false },
    });

    let complaintCount = 0;
    try {
      complaintCount = await Complaint.countDocuments({ productId: req.params.id });
    } catch (_) {}

    res.json({
      views: product.viewCount,
      sold: product.soldCount,
      revenue: product.soldCount * product.price,
      conversionRate: product.viewCount
        ? ((product.soldCount / product.viewCount) * 100).toFixed(1)
        : 0,
      avgRating: product.rating,
      ratingCount: product.ratingCount,
      reviewCount,
      questionCount,
      unansweredQuestions: unanswered,
      complaintCount,
      stock: product.stock,
      price: product.price,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMyProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  duplicateProduct,
  toggleVisibility,
  toggleFeatured,
  updateStatus,
  inlineEdit,
  deleteImage,
  getProductReviews,
  getProductQuestions,
  answerQuestion,
  getProductAnalytics,
};
