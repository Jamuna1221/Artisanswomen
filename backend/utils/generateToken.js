const jwt = require("jsonwebtoken");

/**
 * Generate a JWT token.
 * @param {string} userId - MongoDB _id of the user
 * @param {string} expiresIn - e.g. "15m", "7d"
 */
const generateToken = (userId, expiresIn = "7d") => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn });
};

module.exports = generateToken;
