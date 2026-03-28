const Buyer = require('../models/buyerModel');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Auth buyer & get token
// @route   POST /api/buyer/login
// @access  Public
const loginBuyer = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login Payload Received:', req.body); // Debugging

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check for user email inside buyers collection
    const user = await Buyer.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.password) {
       return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = generateToken(user._id, '30d');
      
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          _id: user._id, // User ID mapped correctly
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
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
    console.log('Register Payload Received:', req.body); // Debugging requirement
    
    const { name, email, password, gender, phone, city, state, age, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check MongoDB if User Exists in buyers collection
    const userExists = await Buyer.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in buyers collection
    const user = await Buyer.create({
      name,
      email,
      password: hashedPassword,
      role: 'buyer',
      gender,
      phone,
      city,
      state,
      age,
      bio
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
