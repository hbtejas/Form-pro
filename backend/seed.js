const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Team = require('./models/Team');
require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/formpro');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Hash password manually (skip pre-save hook to avoid double-hash issues)
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create user with pre-hashed password (use insertOne to bypass hooks)
    const userDoc = await mongoose.connection.db.collection('users').insertOne({
      email: 'tejas@example.com',
      password: hashedPassword,
      full_name: 'Tejas',
      has_desk_access: true,
      roles: ['admin'],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('👤 User created: tejas@example.com / password123');

    // Create team
    const teamDoc = await Team.create({
      team_name: 'Default Team',
      owner: userDoc.insertedId
    });
    console.log('🏢 Team created: Default Team');

    // Update user with team reference
    await mongoose.connection.db.collection('users').updateOne(
      { _id: userDoc.insertedId },
      { $set: { current_team: teamDoc._id } }
    );
    console.log('✅ User linked to team');

    // Verify by querying back
    const verifyUser = await mongoose.connection.db.collection('users').findOne({ email: 'tejas@example.com' });
    const passwordOk = await bcrypt.compare('password123', verifyUser.password);
    console.log(`\n🔐 Credential verification: Email=tejas@example.com, Password match=${passwordOk}`);

    console.log('\n✅ Seed complete! Login with:');
    console.log('   Email:    tejas@example.com');
    console.log('   Password: password123\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
