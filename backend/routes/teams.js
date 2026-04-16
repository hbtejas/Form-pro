const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function teamMemberFromUser(user, overrides = {}) {
  return {
    email: user.email,
    full_name: user.full_name || user.email,
    user_image: null,
    can_edit_team: false,
    is_owner: false,
    ...overrides
  };
}

async function listTeamMembers(team) {
  const owner = await User.findById(team.owner).select('email full_name');
  const members = (team.members || []).map((m) => ({
    email: m.email,
    full_name: m.full_name || m.email,
    user_image: m.user_image || null,
    can_edit_team: !!m.can_edit_team,
    is_owner: !!m.is_owner
  }));

  if (owner && !members.some((m) => m.email === owner.email)) {
    members.unshift(teamMemberFromUser(owner, { can_edit_team: true, is_owner: true }));
  }
  return members;
}

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
      logo: req.body.logo_url || null,
      members: [
        {
          email: req.user.email,
          full_name: req.user.full_name || req.user.email,
          user_image: null,
          can_edit_team: true,
          is_owner: true
        }
      ]
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

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.id, owner: req.user._id });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (typeof req.body.team_name === 'string' && req.body.team_name.trim()) {
      team.team_name = req.body.team_name.trim();
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'logo')) {
      team.logo = req.body.logo || null;
    }

    await team.save();
    res.json(team);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id/members', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(await listTeamMembers(team));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/invite', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const emails = Array.isArray(req.body.emails) ? req.body.emails : [];
    const normalized = emails.map(normalizeEmail).filter(Boolean);

    team.invited_emails = Array.from(new Set([...(team.invited_emails || []), ...normalized]));

    for (const email of normalized) {
      const existing = (team.members || []).some((m) => m.email === email);
      if (existing) continue;

      const user = await User.findOne({ email }).select('email full_name');
      if (user) {
        team.members.push(teamMemberFromUser(user));
      } else {
        team.members.push({
          email,
          full_name: email,
          user_image: null,
          can_edit_team: false,
          is_owner: false
        });
      }
    }

    await team.save();
    res.json({ invited: normalized.length, members: await listTeamMembers(team) });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id/members/toggle-permission', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const email = normalizeEmail(req.body.member_email);
    const member = (team.members || []).find((m) => m.email === email);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    if (member.is_owner) return res.status(400).json({ message: 'Cannot change owner permissions' });

    member.can_edit_team = !member.can_edit_team;
    await team.save();
    res.json(await listTeamMembers(team));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/:id/members/remove', authMiddleware, async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const email = normalizeEmail(req.body.member_email);
    team.members = (team.members || []).filter((m) => m.email !== email || m.is_owner);
    await team.save();

    res.json(await listTeamMembers(team));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
