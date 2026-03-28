const express = require('express');
const router = express.Router();
const { getBuyers } = require('../controllers/adminBuyerController');

// Add admin authentication middleware here if available, e.g., protect, isAdmin
// const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBuyers); // GET /api/admin/buyers

module.exports = router;
