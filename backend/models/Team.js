const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  team_name: { type: String, required: true },
  logo: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Team', TeamSchema);
