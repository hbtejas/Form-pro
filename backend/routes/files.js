const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage });

// File upload endpoint
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    message: 'File uploaded successfully',
    file_url: fileUrl,
    filename: req.file.filename
  });
});

module.exports = router;
