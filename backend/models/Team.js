const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  team_name: { type: String, required: true },
  logo: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [
    {
      email: { type: String, required: true },
      full_name: { type: String, default: '' },
      user_image: { type: String, default: null },
      can_edit_team: { type: Boolean, default: false },
      is_owner: { type: Boolean, default: false }
    }
  ],
  invited_emails: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
