const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Auth buyer & get token
// @route   POST /api/buyer/login
// @access  Public
const loginBuyer = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Always check the Users collection
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email not registered' });
    }

    // Ensure they are actually a buyer or at least have a role that can login here
    if (user.role === 'seller' && user.verificationStatus !== 'Approved') {
        return res.status(403).json({ message: "Seller account pending approval" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = generateToken(user._id, '30d');

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Buyer login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Register a new buyer
// @route   POST /api/buyer/register
// @access  Public
const registerBuyer = async (req, res) => {
  try {
    const { name, email, password, gender, phone, city, state, age, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check in unified collection
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'buyer',
      gender,
      phone,
      city,
      state,
      age: age ? Number(age) : undefined,
      bio,
      isVerified: true // Buyers don't need verification
    });

    if (user) {
      const token = generateToken(user._id, '30d');
      res.status(201).json({
        success: true,
        message: 'Buyer registered successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Buyer registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  loginBuyer,
  registerBuyer
};
