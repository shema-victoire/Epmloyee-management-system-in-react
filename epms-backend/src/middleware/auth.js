const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'epms_jwt_secret'
    );

    // Find user by ID
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user to request object
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Middleware to restrict access based on role
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};

module.exports = { protect, restrictTo }; 