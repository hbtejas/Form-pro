const express = require('express');
const router = express.Router();

router.get('/brand-logo', (req, res) => {
  // Frontend handles null by showing a text fallback.
  res.json(null);
});

router.get('/website-settings', (req, res) => {
  res.json({
    disable_sign_up: false,
    app_name: 'Forms Pro'
  });
});

module.exports = router;
