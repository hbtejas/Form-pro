const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get all teams for current user (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const teams = await Team.find({ owner: req.user._id });

    // Mark which team is current
    const teamsWithCurrent = teams.map(team => ({
      ...team.toObject(),
      is_current: user.current_team?.toString() === team._id.toString()
    }));

    res.json(teamsWithCurrent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create team (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const team = new Team({
      team_name: req.body.team_name,
      owner: req.user._id,
      logo: req.body.logo_url || null
    });
    const newTeam = await team.save();

    // If user has no current team, set this as current
    const user = await User.findById(req.user._id);
    if (!user.current_team) {
      user.current_team = newTeam._id;
      await user.save();
    }

    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Switch team (protected)
router.post('/switch/:id', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.id, owner: req.user._id });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    await User.findByIdAndUpdate(req.user._id, { current_team: team._id });
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
