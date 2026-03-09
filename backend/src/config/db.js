const sequelize = require('./database');
const logger = require('../utils/logger');
require('../models/index'); // Load models and associations

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.info('PostgreSQL Connected successfully via Sequelize');
        
        // Auto-create/sync tables
        await sequelize.sync({ alter: true });
        logger.info('Database tables synchronized');
    } catch (error) {
        logger.error(`Error connecting to PostgreSQL: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
