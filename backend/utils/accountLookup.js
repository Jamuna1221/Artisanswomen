const User = require("../models/User");
const Buyer = require("../models/buyerModel");

/**
 * Resolve logged-in account from either unified User collection or legacy Buyer collection.
 */
async function findAccountById(id) {
  if (!id) return null;
  let doc = await User.findById(id).select("-password -otp -otpExpiry");
  if (!doc) {
    doc = await Buyer.findById(id).select("-password");
  }
  return doc;
}

function isLegacyBuyer(doc) {
  return doc && doc.constructor && doc.constructor.modelName === "Buyer";
}

/** Orders linked to this account (legacy buyerId or userId) */
function orderScopeFilter(userId) {
  return {
    $or: [{ buyerId: userId }, { userId: userId }],
  };
}

module.exports = { findAccountById, isLegacyBuyer, orderScopeFilter };
