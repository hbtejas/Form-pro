const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Team = require('./models/Team');

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@formpro.local';
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123456';
const DEFAULT_ADMIN_NAME = process.env.DEFAULT_ADMIN_NAME || 'Form Pro Admin';
const DEFAULT_TEAM_NAME = process.env.DEFAULT_TEAM_NAME || 'Default Team';

async function ensureBootstrapData() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/formpro');

  let user = await User.findOne({ email: DEFAULT_ADMIN_EMAIL.toLowerCase() });

  if (!user) {
    user = await User.create({
      email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
      password: DEFAULT_ADMIN_PASSWORD,
      full_name: DEFAULT_ADMIN_NAME,
      has_desk_access: true,
      roles: ['admin'],
    });
    console.log(`Created admin user: ${DEFAULT_ADMIN_EMAIL}`);
  } else {
    console.log(`Admin user already exists: ${DEFAULT_ADMIN_EMAIL}`);
  }

  let team = null;
  if (user.current_team) {
    team = await Team.findById(user.current_team);
  }

  if (!team) {
    team = await Team.create({
      team_name: DEFAULT_TEAM_NAME,
      owner: user._id,
      members: [
        {
          email: user.email,
          full_name: user.full_name || DEFAULT_ADMIN_NAME,
          can_edit_team: true,
          is_owner: true,
        },
      ],
    });

    user.current_team = team._id;
    await user.save();

    console.log(`Created default team: ${DEFAULT_TEAM_NAME}`);
  } else {
    console.log(`User already linked to team: ${team.team_name}`);
  }

  console.log('Bootstrap complete. Login credentials:');
  console.log(`Email: ${DEFAULT_ADMIN_EMAIL}`);
  console.log(`Password: ${DEFAULT_ADMIN_PASSWORD}`);
}

ensureBootstrapData()
  .catch((err) => {
    console.error('Bootstrap failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
