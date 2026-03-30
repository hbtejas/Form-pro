const mongoose = require('mongoose');

const FormSubmissionSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  submitted_by: { type: String }, // User ID or 'Guest'
  status: { type: String, enum: ['Draft', 'Submitted'], default: 'Submitted' }
}, { timestamps: true });

module.exports = mongoose.model('FormSubmission', FormSubmissionSchema);
