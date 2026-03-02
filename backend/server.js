const mongoose = require('mongoose');
const app = require('./src/app');
const config = require('./src/config/env');
const logger = require('./src/utils/logger');
let server;

const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoose.url, config.mongoose.options);
        logger.info('Connected to MongoDB');
    } catch (error) {
        if (error.name === 'MongoNetworkError' || error.name === 'MongooseServerSelectionError') {
            logger.warn('Local MongoDB connection failed. Starting in-memory MongoDB server...');
            mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri, config.mongoose.options);
            logger.info(`Connected to in-memory MongoDB at ${uri}`);
        } else {
            throw error;
        }
    }
    server = app.listen(config.port, () => {
        logger.info(`Listening to port ${config.port}`);
    });
};

connectDB();

const exitHandler = async () => {
    if (server) {
        server.close(async () => {
            logger.info('Server closed');
            if (mongoServer) {
                await mongoServer.stop();
                logger.info('In-memory MongoDB stopped');
            }
            process.exit(1);
        });
    } else {
        if (mongoServer) {
            await mongoServer.stop();
        }
        process.exit(1);
    }
};


const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
