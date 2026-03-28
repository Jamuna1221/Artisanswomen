const mongoose = require('mongoose');

const sellerSettingsSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    storeProfile: {
        banner: { data: Buffer, contentType: String },
        logo: { data: Buffer, contentType: String },
        storeName: { type: String, default: '' },
        craftType: { type: String, default: '' },
        artisanStory: { type: String, default: '' },
    },
    account: {
        fullName: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        language: { type: String, default: 'English' },
        paymentDetails: { type: String, default: '' },
    },
    notifications: {
        newOrderAlerts: { type: Boolean, default: true },
        paymentUpdates: { type: Boolean, default: true },
        newMessages: { type: Boolean, default: true },
        lowStockAlerts: { type: Boolean, default: true },
        newReviews: { type: Boolean, default: false },
    }
}, { timestamps: true });

module.exports = mongoose.model('SellerSettings', sellerSettingsSchema);
