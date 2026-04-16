const express = require('express');
const router = express.Router();
const FormSubmission = require('../models/FormSubmission');

router.get('/:id', async (req, res) => {
  try {
    const submission = await FormSubmission.findById(req.params.id);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const update = {};
    if (Object.prototype.hasOwnProperty.call(req.body, 'data')) {
      update.data = req.body.data;
    }
    if (typeof req.body.status === 'string') {
      update.status = req.body.status;
    }

    const submission = await FormSubmission.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    res.json(submission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
