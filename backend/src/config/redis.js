const config = require('../config/env');
const logger = require('../utils/logger');
let redisClient;

if (config.redis.url) {
    const Redis = require('ioredis');
    redisClient = new Redis(config.redis.url, {
        maxRetriesPerRequest: null,
        retryStrategy: (times) => {
            if (times > 3) {
                logger.error('Redis connection failed, disabling redis.');
                return null; // Stop retrying
            }
            return Math.min(times * 50, 2000);
        }
    });

    redisClient.on('error', (err) => {
        // Just log a warning, don't crash
        logger.warn('Redis is not running. Caching will be disabled.');
    });
    redisClient.on('connect', () => logger.info('Redis Client Connected'));
}

module.exports = redisClient;
