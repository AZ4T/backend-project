const mongoose = require('mongoose');
const path = require('path');

const dbCheckMiddleware = async (req, res, next) => {
    try {
        // Check database connection state
        if (mongoose.connection.readyState !== 1) { // 1 = connected
            throw new Error('Database is not connected');
        }

        next(); // Proceed to the next middleware/route handler
    } catch (error) {

        console.error('Database check failed:', error.message);
        return res.status(503).sendFile(path.join(__dirname, '../../frontend/pages/dbfail.html'));
    }
};

module.exports = dbCheckMiddleware;