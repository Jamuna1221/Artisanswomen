const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatGroup', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderName: { type: String }, // cached for speed
    messageType: { type: String, enum: ['text', 'image', 'file', 'audio', 'system'], default: 'text' },
    content: { type: String, required: true },
    attachmentUrl: { type: String }, // base64 or URL
    status: { type: String, enum: ['sent', 'delivered', 'seen'], default: 'sent' },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('GroupMessage', groupMessageSchema);
