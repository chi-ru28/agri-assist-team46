const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const aiService = require('../services/aiService');
const weatherService = require('../services/weatherService');
const { ChatHistory, Farmer } = require('../models/index');
const reportService = require('../services/reportService');
const logger = require('../utils/logger');

const getHistory = catchAsync(async (req, res) => {
    const chatHistory = await ChatHistory.findOne({ where: { userId: req.user.id } });
    if (!chatHistory) {
        return res.status(httpStatus.OK).send({ messages: [] });
    }
    res.status(httpStatus.OK).send({ messages: chatHistory.messages });
});

const chat = catchAsync(async (req, res) => {
    const message = req.body.message || '';
    const file = req.file;
    const role = req.user.role;
    let weatherWarning = '';

    if (role === 'farmer') {
        const farmer = await Farmer.findOne({ where: { userId: req.user.id } });
        if (farmer) {
            const weather = await weatherService.getWeatherForecast(farmer.address || 'Unknown', farmer.location.coordinates);
            if (weather && weather.rainProbability > 60) {
                weatherWarning = `There is a high chance of rain (${weather.rainProbability}%) in your area.`;
            }
        }
    }

    let aiReply;
    if (file) {
        // Handle multimodal message
        aiReply = await aiService.generateMultimodalChatResponse(role, message, file, weatherWarning);
    } else {
        // Text-only mode
        aiReply = await aiService.generateChatResponse(role, message, weatherWarning);
    }

    // Update history
    let chatHistory = await ChatHistory.findOne({ where: { userId: req.user.id } });

    // Check if message is empty to avoid storing empty user messages (just image descriptions)
    const userContent = file ? (message ? message : `[Attached Image]`) : message;
    const userMsg = { role: 'user', content: userContent };
    const aiMsg = { role: 'ai', content: aiReply.text || JSON.stringify(aiReply), tokensUsed: aiReply.tokensUsed };

    if (!chatHistory) {
        await ChatHistory.create({ userId: req.user.id, messages: [userMsg, aiMsg] });
    } else {
        chatHistory.messages = [...(chatHistory.messages || []), userMsg, aiMsg];
        chatHistory.changed('messages', true);
        await chatHistory.save();
    }

    res.status(httpStatus.OK).send({
        reply: aiReply.text,
        tokens: aiReply.tokensUsed,
        weatherContextApplied: !!weatherWarning,
        audioUrl: aiReply.audioUrl,
        detectedLanguage: aiReply.detectedLanguage,
        isAnalysis: !!file, // If they sent an image, standard reply might be JSON vs text
        analysisData: file ? aiReply.analysis : null
    });
});

const generateReport = catchAsync(async (req, res) => {
    const chatHistory = await ChatHistory.findOne({ where: { userId: req.user.id } });
    if (!chatHistory || !chatHistory.messages || chatHistory.messages.length === 0) {
        return res.status(httpStatus.OK).send({ content: "No history available." });
    }
    const report = await reportService.generateChatReport(req.user.id, chatHistory.messages);
    res.status(httpStatus.OK).send(report);
});

module.exports = {
    chat,
    getHistory,
    generateReport
};
