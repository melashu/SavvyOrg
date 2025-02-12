const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer storage to save images to a directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/"; // Directory for profile pictures
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to the filename to avoid name conflicts
  },
});

const upload = multer({ storage });

module.exports = { upload };
