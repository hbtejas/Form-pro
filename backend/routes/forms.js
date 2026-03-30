const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const FormSubmission = require('../models/FormSubmission');

// Get all forms
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.team_id) filters.team = req.query.team_id;
    const forms = await Form.find(filters).sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single form by ID or Route
router.get('/:idOrRoute', async (req, res) => {
  try {
    const form = await Form.findOne({
      $or: [
        { _id: req.params.idOrRoute.match(/^[0-9a-fA-F]{24}$/) ? req.params.idOrRoute : null },
        { route: req.params.idOrRoute }
      ].filter(f => f !== null)
    });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create form
router.post('/', async (req, res) => {
  const form = new Form(req.body);
  try {
    const newForm = await form.save();
    res.status(201).json(newForm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update form
router.put('/:id', async (req, res) => {
  try {
    const updatedForm = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedForm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get public form
router.get('/public/:idOrRoute', async (req, res) => {
  try {
    const form = await Form.findOne({
      $or: [
        { _id: req.params.idOrRoute.match(/^[0-9a-fA-F]{24}$/) ? req.params.idOrRoute : null },
        { route: req.params.idOrRoute }
      ].filter(f => f !== null)
    });
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit form response
router.post('/:id/submissions', async (req, res) => {
  try {
    const submission = new FormSubmission({
      form: req.params.id,
      data: req.body.values, // Store body.values
      submitted_by: req.body.user_id || 'Guest'
    });
    await submission.save();
    res.status(201).json(submission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Validate route uniqueness
router.get('/validate-route/:route', async (req, res) => {
  try {
    const count = await Form.countDocuments({ 
      route: req.params.route,
      _id: { $ne: req.query.exclude_id }
    });
    res.json({ exists: count > 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Check if login required
router.get('/login-required', async (req, res) => {
  try {
    const form = await Form.findOne({ route: req.query.route });
    res.json({ loginRequired: form ? form.login_required : false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

