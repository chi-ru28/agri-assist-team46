const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

const ML_SERVER_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000';

const predictImage = async (filePath) => {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        const response = await axios.post(`${ML_SERVER_URL}/predict-image`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        return response.data;
    } catch (error) {
        logger.error('ML Service Error (Image):', error.message);
        throw new ApiError(502, 'Failed to connect to ML prediction service for image');
    }
};

const predictFertilizer = async (data) => {
    try {
        const response = await axios.post(`${ML_SERVER_URL}/predict-fertilizer`, data);
        return response.data;
    } catch (error) {
        logger.error('ML Service Error (Fertilizer):', error.message);
        throw new ApiError(502, 'Failed to connect to ML prediction service for fertilizer');
    }
};

module.exports = {
    predictImage,
    predictFertilizer
};
