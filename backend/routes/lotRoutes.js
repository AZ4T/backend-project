const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/multer');
const lotController = require('../controllers/lotController');

// route for lot creation
router.post('/sendlot', upload.single('photo'), lotController.createLot);

module.exports = router;