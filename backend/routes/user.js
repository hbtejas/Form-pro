const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get current user
router.get('/current', async (req, res) => {
  try {
    const user = await User.findOne(); // Placeholder: returns first user
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update theme preference
router.post('/theme', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({}, { theme: req.body.theme }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
