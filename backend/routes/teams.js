const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// Get all teams for current user
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find(); // For simplicity, returning all
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create team
router.post('/', async (req, res) => {
  const team = new Team(req.body);
  try {
    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Switch team (mock update is_current)
router.post('/switch/:id', async (req, res) => {
  try {
    await Team.updateMany({}, { is_current: false });
    const team = await Team.findByIdAndUpdate(req.params.id, { is_current: true }, { new: true });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
