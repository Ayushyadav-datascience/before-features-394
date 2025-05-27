const { Sequelize } = require('sequelize');

// Initialize Sequelize connection
// Use DATABASE_URL if available (external database), otherwise use individual params
const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, { 
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false
    })
  : new Sequelize({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'nodeapp',
      logging: false,
    });

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connection established successfully.');
    
    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.log('Continuing without database connection. Some features may not work.');
  }
};

module.exports = { connectDB, sequelize };
