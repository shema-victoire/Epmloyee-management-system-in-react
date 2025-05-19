const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Adding a temporary route to create admin
router.get('/create-admin', async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { username: 'admin' } });
    if (existingUser) {
      return res.status(200).json({ message: 'Admin user already exists' });
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    const newUser = await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });

    res.status(201).json({
      message: 'Admin user created successfully',
      username: newUser.username
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'epms_jwt_secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register route - for admin use only
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create user
    const newUser = await User.create({
      username,
      password,
      role: role || 'user',
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 