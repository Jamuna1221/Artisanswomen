const Product = require("../models/Product");
const { createAdminNotification } = require("../utils/notificationHelper");

const getProducts = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate("artisanId", "name email")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ products, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { status, rejectionReason: rejectionReason || "" },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Notify admin
    await createAdminNotification("Product", `Product status updated to ${status}`, {
      productId: product._id,
      rejectionReason: rejectionReason || "N/A"
    });

    res.json({ message: `Product ${status}`, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("artisanId", "name email")
      .populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getProducts, updateProductStatus, deleteProduct, getProductById };
