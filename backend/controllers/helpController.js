const Order = require("../models/Order");
const FAQ = require("../models/FAQ");

// @desc    Track order status by ID
// @route   GET /api/help/track/:orderId
// @access  Public
const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("buyerId", "name email")
      .select("orderStatus estimatedDeliveryDate items totalAmount createdAt");

    if (!order) {
      return res.status(404).json({ message: "Order not found. Please check your Order ID." });
    }

    res.status(200).json({
      orderId: order._id,
      status: order.orderStatus,
      estimatedDeliveryDate: order.estimatedDeliveryDate || "TBA",
      createdAt: order.createdAt,
      products: order.items,
      totalAmount: order.totalAmount
    });
  } catch (error) {
    console.error("Track Order Error:", error);
    res.status(400).json({ message: "Invalid Order ID format" });
  }
};

// @desc    Get all FAQs
// @route   GET /api/help/faqs
// @access  Public
const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    // If no FAQs in DB, return some defaults so the UI isn't empty
    if (faqs.length === 0) {
      return res.status(200).json([
        {
          question: "How to register as an artisan?",
          answer: "You can register by clicking the 'Register' button on the artisan portal and completing the KYC verification process."
        },
        {
          question: "How long does approval take?",
          answer: "Our team usually reviews and approves artisan profiles within 24-48 business hours."
        },
        {
          question: "How to contact support?",
          answer: "You can reach us at artisanswomen@gmail.com for any queries or assistance."
        }
      ]);
    }
    res.status(200).json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};

// @desc    Add a single FAQ (for maintenance/initial seed)
// @route   POST /api/help/faqs
// @access  Private/Admin
const addFAQ = async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    const faq = await FAQ.create({ question, answer, category });
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: "Invalid FAQ data" });
  }
};

module.exports = { trackOrder, getFAQs, addFAQ };
