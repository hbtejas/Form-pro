const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Team = require('../models/Team');
const authMiddleware = require('../middleware/auth');

// Get current user profile (protected)
router.get('/current', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('current_team');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update theme preference (protected)
router.post('/theme', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { theme: req.body.theme },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user basic profile by ID or email
router.get('/:idOrEmail', async (req, res) => {
  try {
    const idOrEmail = String(req.params.idOrEmail || '').trim();
    const query = idOrEmail.match(/^[0-9a-fA-F]{24}$/)
      ? { _id: idOrEmail }
      : { email: idOrEmail.toLowerCase() };
    const user = await User.findOne(query).select('full_name email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      full_name: user.full_name || user.email,
      user_image: null,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
