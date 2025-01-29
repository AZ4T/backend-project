const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// route for user registration
router.post('/signup', userController.signUp);

// route for login
router.post('/signin', userController.signIn);

// route for logout
router.post('/logout', userController.logout);

// route for balance
router.post('/balance', userController.balance);

// route for profile information
router.get('/getInfoProfile', userController.getInfoProfile);

// route for profile update information
router.post('/updateInfo', userController.updateInfo);

// Verify 2FA
router.post('/verify2fa', userController.verify2FA);

// Verify 2FA login
router.post('/verify2fa-login', userController.verify2FALogin);

module.exports = router;
