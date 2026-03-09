const { Sequelize } = require('sequelize');
const config = require('./env');
const logger = require('../utils/logger');

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: 'postgres',
  logging: (msg) => logger.debug(msg),
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
