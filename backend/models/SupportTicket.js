const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    category: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved', 'Closed'], default: 'Open' }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
