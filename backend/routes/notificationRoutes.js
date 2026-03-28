const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const { protect } = require("../middleware/authMiddleware");
const { createSellerNotification, createAdminNotification } = require("../utils/notificationHelper");

// ─── GET /api/notifications/seller ──────────────────────────────────────────
// Fetch all notifications for logged-in seller
router.get("/seller", protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipientId: req.user._id, recipientType: "seller" })
            .sort({ createdAt: -1 });
        const unreadCount = notifications.filter(n => !n.isRead).length;

        res.json({ notifications, unreadCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ─── PATCH /api/notifications/seller/:id/read ─────────────────────────────
// Seller marks a notification read
router.patch("/seller/:id/read", protect, async (req, res) => {
    try {
        const notif = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipientId: req.user._id },
            { isRead: true, readAt: new Date() },
            { new: true }
        );
        res.json(notif);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ─── PATCH /api/notifications/seller/mark-all-read ────────────────────────
router.patch("/seller/mark-all-read", protect, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipientId: req.user._id, isRead: false },
            { isRead: true, readAt: new Date() }
        );
        res.json({ message: "All marked as read" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ─── POST /api/notifications/admin/send-to-seller ─────────────────────────
// Admin sending direct notification to a seller
// Note: You should have an 'admin' middleware to protect this securely
router.post("/admin/send-to-seller", async (req, res) => {
    // Replace with appropriate admin middleware checks if needed
    try {
        const { sellerId, title, message, type, priority } = req.body;

        if (!sellerId || !title || !message) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const noti = await createSellerNotification(sellerId, title, message, type || "info", priority || "normal");
        res.status(201).json({ message: "Notification sent to seller", notification: noti });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin fetching new schema notifications (Fallback + new types)
router.get("/admin/all", async (req, res) => {
    try {
        const notifications = await Notification.find({
            $or: [{ recipientType: "admin" }, { adminId: { $exists: true } }]
        }).sort({ createdAt: -1 });

        const unreadCount = notifications.filter(n => !n.isRead).length;
        res.json({ notifications, unreadCount });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin mark as read
router.patch("/admin/:id/read", async (req, res) => {
    try {
        const notif = await Notification.findOneAndUpdate(
            { _id: req.params.id },
            { isRead: true, readAt: new Date() },
            { new: true }
        );
        res.json(notif);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
