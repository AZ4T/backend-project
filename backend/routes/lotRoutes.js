const express = require('express');
const router = express.Router();
const lotController = require('../controllers/lotController');
const { upload } = require('../middleware/multer');
const { auth } = require('../middleware/auth');

// route for lot creation
router.post('/sendlot', auth, upload.single('photo'), lotController.createLot);

module.exports = router;