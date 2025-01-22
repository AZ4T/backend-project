const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Apply authentication middleware to all admin routes


// Apply both auth and admin check to all routes
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.put('/users/:id', adminController.updateUser);


module.exports = router;