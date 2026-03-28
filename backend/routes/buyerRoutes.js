const express = require('express');
const router = express.Router();

const { loginBuyer, registerBuyer } = require('../controllers/buyerController');

// @route   POST /api/buyer/login
// @desc    Auth buyer & get token
// @access  Public
router.post('/login', loginBuyer);

// @route   POST /api/buyer/register
// @desc    Register buyer directly into buyers collection
// @access  Public
router.post('/register', registerBuyer);

// --- Optional Stub endpoints existing in project ---
router.get('/products', async (req, res) => {
  try { res.json({ message: 'Buyer products route working', products: [] }); } 
  catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); }
});
router.get('/categories', async (req, res) => {
  try { res.json({ message: 'Buyer categories route working', categories: [] }); } 
  catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); }
});
router.get('/profile', async (req, res) => {
  try { res.json({ message: 'Buyer profile route working' }); } 
  catch (error) { res.status(500).json({ message: 'Server error', error: error.message }); }
});

module.exports = router;
