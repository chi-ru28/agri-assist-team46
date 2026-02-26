const axios = require('axios');
const logger = require('../utils/logger');
let redisClient;
try {
    redisClient = require('../config/redis');
} catch (e) {
    redisClient = null;
}

const CACHE_TTL = 1800; // 30 minutes in seconds

const getWeatherForecast = async (locationStr, coordinates = []) => {
    try {
        const cacheKey = `weather:${locationStr}`;

        if (redisClient) {
            const cached = await redisClient.get(cacheKey);
            if (cached) {
                return JSON.parse(cached);
            }
        }

        // Replace this with actual OpenWeather/WeatherAPI call later.
        // Simulating call...
        const rainProbability = Math.floor(Math.random() * 100);
        const temp = Math.floor(Math.random() * (40 - 15 + 1) + 15);

        const weatherData = {
            location: locationStr,
            coordinates,
            temperatureC: temp,
            rainProbability: rainProbability,
            forecast: rainProbability > 60 ? 'Heavy rain possible' : 'Clear skies',
            timestamp: Date.now()
        };

        if (redisClient) {
            await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(weatherData));
        }

        return weatherData;
    } catch (error) {
        logger.error("Weather Service Error:", error);
        return {
            location: locationStr || 'Unknown',
            rainProbability: 0,
            forecast: 'Service unavailable'
        };
    }
};

module.exports = {
    getWeatherForecast
};
