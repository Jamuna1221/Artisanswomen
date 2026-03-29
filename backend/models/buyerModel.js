const mongoose = require('mongoose');

const buyerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'buyer'
    },
    gender: {
      type: String,
      enum: ['Woman', 'Transwoman', 'Women', 'Transwomen'],
      default: 'Woman'
    },
    phone: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    age: {
      type: Number
    },
    bio: {
      type: String
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  },
  {
    timestamps: true
  }
);

// Explicitly mapping to 'buyers' collection
const Buyer = mongoose.model('Buyer', buyerSchema, 'buyers');

module.exports = Buyer;
