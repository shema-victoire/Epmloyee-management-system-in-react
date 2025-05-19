require('dotenv').config();
const { sequelize } = require('./models');
const seedData = require('./seeders/sampleData');

const seedDB = async () => {
  try {
    // Sync database (force: true will drop tables and recreate)
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');

    // Seed data
    await seedData();

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB(); 