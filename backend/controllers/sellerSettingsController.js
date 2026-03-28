const SellerSettings = require('../models/SellerSettings');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const { sendSupportEmail } = require('../utils/sendEmail');

const getOrCreateSettings = async (sellerId, user) => {
    let settings = await SellerSettings.findOne({ sellerId });
    if (!settings) {
        settings = await SellerSettings.create({
            sellerId,
            storeProfile: {
                storeName: user.name + "'s Store",
                craftType: user.craftType?.length ? user.craftType[0] : '',
                artisanStory: user.bio || ''
            },
            account: {
                fullName: user.name,
                email: user.email,
                phone: user.phone || ''
            }
        });
    }
    return settings;
};

exports.getSettings = async (req, res) => {
    try {
        let settings = await getOrCreateSettings(req.user._id, req.user);

        // We want to avoid sending raw buffers in every get request, instead we return a flag
        // to let the frontend know an image exists
        const settingsObj = settings.toObject();

        if (settingsObj.storeProfile.banner?.data) {
            settingsObj.storeProfile.bannerUrl = `data:${settingsObj.storeProfile.banner.contentType};base64,${settingsObj.storeProfile.banner.data.toString('base64')}`;
            delete settingsObj.storeProfile.banner.data;
        }
        if (settingsObj.storeProfile.logo?.data) {
            settingsObj.storeProfile.logoUrl = `data:${settingsObj.storeProfile.logo.contentType};base64,${settingsObj.storeProfile.logo.data.toString('base64')}`;
            delete settingsObj.storeProfile.logo.data;
        }

        res.json(settingsObj);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings', error: error.message });
    }
};

exports.updateStoreProfile = async (req, res) => {
    try {
        const settings = await getOrCreateSettings(req.user._id, req.user);

        if (req.body.storeName) settings.storeProfile.storeName = req.body.storeName;
        if (req.body.craftType) settings.storeProfile.craftType = req.body.craftType;
        if (req.body.artisanStory !== undefined) settings.storeProfile.artisanStory = req.body.artisanStory;

        // Handle files
        if (req.files && req.files.banner) {
            settings.storeProfile.banner = {
                data: req.files.banner[0].buffer,
                contentType: req.files.banner[0].mimetype
            };
        }
        if (req.files && req.files.logo) {
            settings.storeProfile.logo = {
                data: req.files.logo[0].buffer,
                contentType: req.files.logo[0].mimetype
            };
        }

        await settings.save();

        const settingsObj = settings.toObject();
        if (settingsObj.storeProfile.banner?.data) {
            settingsObj.storeProfile.bannerUrl = `data:${settingsObj.storeProfile.banner.contentType};base64,${settingsObj.storeProfile.banner.data.toString('base64')}`;
            delete settingsObj.storeProfile.banner.data;
        }
        if (settingsObj.storeProfile.logo?.data) {
            settingsObj.storeProfile.logoUrl = `data:${settingsObj.storeProfile.logo.contentType};base64,${settingsObj.storeProfile.logo.data.toString('base64')}`;
            delete settingsObj.storeProfile.logo.data;
        }

        res.json({ message: 'Store profile updated successfully', settings: settingsObj });
    } catch (error) {
        res.status(500).json({ message: 'Error updating store profile', error: error.message });
    }
};

exports.updateAccount = async (req, res) => {
    try {
        const settings = await getOrCreateSettings(req.user._id, req.user);
        const { fullName, email, phone, language, paymentDetails } = req.body;

        if (fullName) settings.account.fullName = fullName;
        if (email) settings.account.email = email;
        if (phone) settings.account.phone = phone;
        if (language) settings.account.language = language;
        if (paymentDetails !== undefined) settings.account.paymentDetails = paymentDetails;

        await settings.save();

        const settingsObj = settings.toObject();
        res.json({ message: 'Account updated successfully', settings: settingsObj });
    } catch (error) {
        res.status(500).json({ message: 'Error updating account', error: error.message });
    }
};

exports.updateNotifications = async (req, res) => {
    try {
        const settings = await getOrCreateSettings(req.user._id, req.user);
        if (req.body.notifications) {
            settings.notifications = { ...settings.notifications.toObject(), ...req.body.notifications };
        }
        await settings.save();
        res.json({ message: 'Notification preferences updated successfully', settings: settings.toObject() });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notifications', error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
};

exports.submitSupportTicket = async (req, res) => {
    try {
        const { subject, category, message } = req.body;
        if (!subject || !category || !message) {
            return res.status(400).json({ message: 'Please provide all support ticket fields' });
        }
        const ticket = await Complaint.create({
            userId: req.user._id,
            subject: `[${category}] ${subject}`,
            message: message
        });

        // Send support email to admin and auto-response to the artisan
        try {
            await sendSupportEmail(req.user.name, req.user.email, subject, category, message);
        } catch (emailErr) {
            console.error('Failed to send support email:', emailErr);
        }

        res.json({ message: 'Support ticket submitted successfully', ticket });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting support ticket', error: error.message });
    }
};
