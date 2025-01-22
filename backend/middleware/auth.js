const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        console.log('Received token:', token);

        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token payload:', decoded);

        const user = await User.findById(decoded.userId);
        console.log('Found user:', {
            id: user._id,
            username: user.username,
            role: user.role
        });

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
};

module.exports = auth;