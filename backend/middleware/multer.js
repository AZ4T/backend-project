const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Provide the local folder path to save the files
        cb(null, path.join(__dirname, '../../frontend/assets/uploads'));  
    },
    filename: function (req, file, cb) {
      // Generate a unique filename, for example:
      // product-photo-<timestamp>.<ext>
        const uniqueName =
            file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

exports.upload = multer({ storage: storage });