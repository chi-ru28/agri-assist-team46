const mongoose = require('mongoose');
const config = require('../config/env');
const logger = require('../utils/logger');
let redisClient;

if (config.redis.url) {
    const Redis = require('ioredis');
    redisClient = new Redis(config.redis.url);

    redisClient.on('error', (err) => logger.error('Redis Client Error', err));
    redisClient.on('connect', () => logger.info('Redis Client Connected'));
}

module.exports = redisClient;
