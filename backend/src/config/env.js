const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config();

const envVarsSchema = Joi.object()
    .keys({
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        PORT: Joi.number().default(5000),
        MONGO_URI: Joi.string().required().description('MongoDB url'),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
        JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
        GEMINI_API_KEY: Joi.string().required().description('Google Gemini API Key'),
        REDIS_URL: Joi.string().default('redis://localhost:6379').description('Redis URL for caching'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mongoose: {
        url: envVars.MONGO_URI,
        options: {},
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
        refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    },
    ai: {
        geminiApiKey: envVars.GEMINI_API_KEY,
    },
    redis: {
        url: envVars.REDIS_URL,
    },
};
