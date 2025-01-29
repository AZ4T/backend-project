const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// route for authorization checking
router.post('/auth', authMiddleware.auth);

module.exports = router;