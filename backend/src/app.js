const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const httpStatus = require('http-status');
const path = require('path');
const config = require('./config/env');
const morgan = require('morgan');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorConverter, errorHandler } = require('./middleware/errorHandler');
const ApiError = require('./utils/ApiError');
const logger = require('./utils/logger');

const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const aiRoutes = require('./routes/aiRoutes');
const shopRoutes = require('./routes/shopRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();

if (config.env !== 'test') {
    app.use(morgan(config.env === 'production' ? 'combined' : 'dev', {
        stream: { write: (message) => logger.info(message.trim()) }
    }));
}

// set security HTTP headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow images

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(mongoSanitize());

// enable cors
app.use(cors());

// limit repeated failed requests to API endpoints
if (config.env === 'production') {
    app.use('/api', apiLimiter);
}

// v1 api routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/weather', weatherRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(httpStatus.OK).send('OK');
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'API format Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
