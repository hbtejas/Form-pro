const mongoose = require('mongoose');
const User = require('./models/User');
const Team = require('./models/Team');
require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/formpro');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    console.log('Cleared existing data');

    // Create a default user first
    const user = new User({
      email: 'tejas@example.com',
      password: 'password123',
      full_name: 'Tejas',
      has_desk_access: true
    });
    await user.save();


    // Create a default team
    const team = await Team.create({
      team_name: 'Default Team',
      owner: user._id
    });

    // Set user's current team
    user.current_team = team._id;
    await user.save();

    console.log('Default user created: tejas@example.com / password123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};



seed();
