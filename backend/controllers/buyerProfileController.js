// controllers/buyerProfileController.js

const Buyer = require("../models/buyerModel"); // Changed to correct existing schema natively

// @desc    Get logged-in buyer's profile
// @route   GET /api/buyer/profile
// @access  Private (requires auth middleware)
const getProfile = async (req, res) => {
    try {
        // req.user should be set by your auth middleware
        const buyer = await Buyer.findById(req.user.id).select("-password");

        if (!buyer) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(buyer);
    } catch (error) {
        console.error("getProfile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update logged-in buyer's profile
// @route   PUT /api/buyer/profile
// @access  Private (requires auth middleware)
const updateProfile = async (req, res) => {
    try {
        const { name, gender, email, phone } = req.body;

        const buyer = await Buyer.findById(req.user.id);

        if (!buyer) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update only provided fields
        if (name !== undefined) buyer.name = name;
        if (gender !== undefined) buyer.gender = gender;
        if (email !== undefined) buyer.email = email;
        if (phone !== undefined) buyer.phone = phone;

        const updatedBuyer = await buyer.save();

        // Return without password
        const result = updatedBuyer.toObject();
        delete result.password;

        res.status(200).json(result);
    } catch (error) {
        console.error("updateProfile error:", error);

        // Handle duplicate email
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already in use" });
        }

        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getProfile, updateProfile };
