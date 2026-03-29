const { isLegacyBuyer } = require("./accountLookup");

/**
 * Mutates `doc` (User or Buyer) from request body. Does not save.
 */
function applyProfileFields(doc, body) {
  const { firstName, lastName, phone, gender, bio, city, state } = body;

  if (isLegacyBuyer(doc)) {
    if (firstName !== undefined || lastName !== undefined) {
      const fn = firstName !== undefined ? firstName : doc.name?.split(" ")[0] || "";
      const ln = lastName !== undefined ? lastName : doc.name?.split(" ").slice(1).join(" ") || "";
      doc.name = `${fn} ${ln}`.trim();
    }
    if (phone !== undefined) doc.phone = phone;
    if (gender !== undefined) doc.gender = gender;
    if (bio !== undefined) doc.bio = bio;
    if (city !== undefined) doc.city = city;
    if (state !== undefined) doc.state = state;
  } else {
    if (firstName !== undefined) doc.firstName = firstName;
    if (lastName !== undefined) doc.lastName = lastName;
    if (firstName !== undefined || lastName !== undefined) {
      doc.name = `${doc.firstName || ""} ${doc.lastName || ""}`.trim() || doc.name;
    }
    if (phone !== undefined) doc.phone = phone;
    if (gender !== undefined) doc.gender = gender;
    if (bio !== undefined) doc.bio = bio;
    if (city !== undefined) doc.city = city;
    if (state !== undefined) doc.state = state;
  }
  return doc;
}

module.exports = { applyProfileFields };
