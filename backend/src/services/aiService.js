const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const config = require('../config/env');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

const genAI = new GoogleGenerativeAI(config.ai.geminiApiKey);

const generateChatResponse = async (role, userMessage, weatherWarning = '') => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let systemPrompt = '';
        if (role === 'farmer') {
            systemPrompt = `You are a highly skilled agriculture expert for AgriAssist. Your advice must be precise and actionable. Cover fertilizer advice, optimal dosage per acre, organic alternatives, and safety precautions. Ensure you avoid generating harmful or unverified chemical advice. Context: Act as a pure domain expert.`;
        } else if (role === 'shopkeeper') {
            systemPrompt = `You are a strategic agro-business advisor for AgriAssist. Provide sophisticated insights into stock planning, forecasting seasonal demand, interpreting market trends, and delivering business growth suggestions. Context: Focus purely on business logistics and sales strategies.`;
        } else {
            systemPrompt = `You are a neutral assistant for AgriAssist. Answer queries concisely within the bounds of agricultural information.`;
        }

        if (weatherWarning) {
            systemPrompt += `\nCRITICAL CONTEXT: ${weatherWarning}. Prioritize addressing this weather warning immediately in your advice if relevant.`;
        }

        const prompt = `${systemPrompt}\n\nUser Question: ${userMessage}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;

        // For advanced token tracking parsing if needed natively from response block
        return {
            text: response.text(),
            // Assuming a generic token count structure mock for the record
            tokensUsed: prompt.length + response.text().length
        };
    } catch (error) {
        logger.error('AI Service Error (Chat):', error);
        throw new ApiError(502, 'Failed to generate AI response');
    }
};

const fileToGenerativePart = (filePath, mimeType) => {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
            mimeType
        },
    };
};

const analyzeImage = async (filePath, mimeType) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Act as an elite crop pathologist. Analyze this plant/crop image. Detect any deficiency or disease immediately.
    You MUST respond with ONLY a raw JSON string using the EXACT structure below. Do not use block-ticks or markdown.
    {
      "deficiency": "Name of deficiency/disease",
      "severity": "Low, Medium, or High",
      "recommendedFertilizer": "Suggested fertilizer/chemical name",
      "dosagePerAcre": "Amount",
      "precautions": "Safety notes",
      "healthScore": 0-100 (integer)
    }`;

        const imageParts = [fileToGenerativePart(filePath, mimeType)];
        const result = await model.generateContent([prompt, ...imageParts]);
        let responseText = await result.response.text();

        // Fallback JSON sanitization
        responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

        const parsedData = JSON.parse(responseText);

        // Delete temporary file to save IO operations later instead of keeping
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return parsedData;
    } catch (error) {
        logger.error("AI Service Error (Vision):", error);
        // Cleanup if fail
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        throw new ApiError(502, 'Failed to process AI image analysis');
    }
};

module.exports = {
    generateChatResponse,
    analyzeImage
};
