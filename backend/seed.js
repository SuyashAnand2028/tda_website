const mongoose = require('mongoose');
const User = require('./models/User');
const TeamMember = require('./models/TeamMember');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tda_website');
    console.log('Connected to MongoDB');

    // Clear existing admin users only (keep any existing team data)
    await User.deleteMany({});

    // Create default admin user
    const adminUser = new User({
      email: process.env.ADMIN_EMAIL || 'admin@tda.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'Admin User',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Default admin user created');

    console.log('Database seeded successfully!');
    console.log('Admin credentials:');
    console.log('Email:', process.env.ADMIN_EMAIL || 'admin@tda.com');
    console.log('Password:', process.env.ADMIN_PASSWORD || 'admin123');
    console.log('');
    console.log('Team data is empty - Admin can add team members through the admin panel');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
