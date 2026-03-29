const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

/**
 * POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const { buyerId, items, totalAmount, shippingAddress, paymentMethod } = req.body;

    // 1. Process Stock Reduction for each item
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product not found: ${item.productId}`);
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.title}`);
      }
      product.stock -= item.quantity;
      await product.save();
    }

    // 2. Create Order
    const order = await Order.create({
      buyerId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: "Completed", // Simulating payment
      orderStatus: "Placing Order"
    });

    // 3. Clear Cart if it was a cart checkout
    await Cart.findOneAndUpdate({ userId: buyerId }, { items: [] });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrders = async (req, res) => {
  // ... (existing logic)
  try {
    const { orderStatus, paymentStatus, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (orderStatus) filter.orderStatus = orderStatus;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate("buyerId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ orders, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("buyerId", "name email phone");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const updates = {};
    if (orderStatus) updates.orderStatus = orderStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
