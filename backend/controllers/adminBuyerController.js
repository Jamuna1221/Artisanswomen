const User = require('../models/User');

// @desc    Get all registered buyers
// @route   GET /api/admin/buyers
// @access  Private/Admin
const getBuyers = async (req, res) => {
  try {
    const { search, status } = req.query;
    
    // Base query: Only role 'buyer'
    const query = { role: 'buyer' };

    // Basic Search Support
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Note: status filter can be added if users have 'status' (e.g. active/banned)

    const buyers = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: buyers.length,
      buyers
    });
  } catch (error) {
    console.error('Error fetching buyers:', error);
    res.status(500).json({ message: 'Server error fetching buyers', error: error.message });
  }
};

module.exports = {
  getBuyers
};
