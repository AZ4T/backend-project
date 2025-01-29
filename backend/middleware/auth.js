const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || user.currentSession !== token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Invalid session',
            });
        }

        req.user = user; // Attach user to the request
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid token',
        });
    }
};