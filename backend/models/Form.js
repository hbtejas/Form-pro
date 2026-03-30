const mongoose = require('mongoose');

const FormFieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  fieldname: { type: String, required: true },
  fieldtype: {
    type: String,
    enum: [
      'Attach', 'Data', 'Number', 'Email', 'Date', 'Date Time', 
      'Date Range', 'Time Picker', 'Password', 'Select', 'Switch', 
      'Textarea', 'Text Editor', 'Link', 'Checkbox', 'Rating', 'Phone', 'Table'
    ],
    required: true
  },
  reqd: { type: Boolean, default: false },
  options: { type: String },
  description: { type: String },
  default: { type: String },
  conditional_logic: { type: String },
  hidden: { type: Boolean, default: false }
});

const FormSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  is_published: { type: Boolean, default: false },
  route: { type: String, unique: true },
  linked_doctype: { type: String }, // For transition, can be generic in MERN
  login_required: { type: Boolean, default: false },
  allow_incomplete: { type: Boolean, default: false },
  success_title: { type: String },
  success_description: { type: String },
  fields: [FormFieldSchema],
  metadata: { type: mongoose.Schema.Types.Mixed },
  owner: { type: String, required: true }, // Map to User ID
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
}, { timestamps: true });

module.exports = mongoose.model('Form', FormSchema);
