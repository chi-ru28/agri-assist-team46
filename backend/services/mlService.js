const axios = require('axios');
const FormData = require('form-data');

const ML_API_BASE_URL = process.env.ML_API_URL || 'http://127.0.0.1:8000';

/**
 * Sends an image buffer to the Python ML API for crop disease detection.
 * @param {Buffer} imageBuffer 
 * @param {String} filename 
 */
const predictImage = async (imageBuffer, filename = 'image.jpg') => {
    try {
        const formData = new FormData();
        formData.append('file', imageBuffer, { filename });

        const response = await axios.post(`${ML_API_BASE_URL}/predict-image`, formData, {
            headers: formData.getHeaders()
        });

        // Expected format: { deficiency: "Rust", confidence: 0.92 }
        return response.data;
    } catch (error) {
        console.error("ML Image Prediction Error:", error.message);
        throw new Error("Failed to process image through ML Service");
    }
};

/**
 * Sends tabular soil NPK data to the Python ML API for fertilizer recommendations.
 * @param {Object} soilData - { N, P, K, temperature, humidity, cropType }
 */
const predictFertilizer = async (soilData) => {
    try {
        const response = await axios.post(`${ML_API_BASE_URL}/predict-fertilizer`, soilData);

        // Expected format: { fertilizer: "Urea", probability: 0.88 }
        return response.data;
    } catch (error) {
        console.error("ML Fertilizer Prediction Error:", error.message);
        throw new Error("Failed to process data through ML Service");
    }
};

module.exports = {
    predictImage,
    predictFertilizer
};
