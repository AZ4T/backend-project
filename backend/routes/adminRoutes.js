const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/auth');

// Apply both auth and admin check to all routes

router.get('/users', auth, adminController.getAllUsers);
router.delete('/users/:id', auth, adminController.deleteUser);
router.put('/users/:id', auth, adminController.updateUser);

router.get('/lots', auth, adminController.getLots);
router.delete('/lots/:id', auth, adminController.deleteLot);
router.put('/lots/:id', auth, adminController.updateLot);

router.get('/auction', auth, adminController.auction);


module.exports = router;