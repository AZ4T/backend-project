const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// route for user registration
router.post('/signup', userController.signUp);

// route for login
router.post('/signin', userController.signIn);

module.exports = router;
