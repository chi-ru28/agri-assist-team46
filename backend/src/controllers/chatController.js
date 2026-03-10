const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const aiService = require('../services/aiService');
const weatherService = require('../services/weatherService');
const { ChatHistory, Farmer } = require('../models/index');
const logger = require('../utils/logger');
const reportService = require('../services/reportService');

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
        if (farmer && farmer.location) {
            const weather = await weatherService.getWeatherForecast(farmer.address || 'Unknown', farmer.location.coordinates);
            if (weather && weather.rainProbability > 60) {
                weatherWarning = `There is a high chance of rain (${weather.rainProbability}%) in your area.`;
            }
        }
    }

    let aiReply;
    if (file) {
        aiReply = await aiService.generateMultimodalChatResponse(role, message, file, weatherWarning);
    } else {
        aiReply = await aiService.generateChatResponse(role, message, weatherWarning);
    }

    // Update history
    let chatHistory = await ChatHistory.findOne({ where: { userId: req.user.id } });

    const userContent = file ? (message ? message : `[Attached Image]`) : message;
    const userMsg = { role: 'user', content: userContent, timestamp: new Date() };
    const aiMsg = { role: 'ai', content: aiReply.text || JSON.stringify(aiReply), tokensUsed: aiReply.tokensUsed, timestamp: new Date() };

    if (!chatHistory) {
        await ChatHistory.create({ userId: req.user.id, messages: [userMsg, aiMsg] });
    } else {
        // In Sequelize with JSONB, we need to re-assign or use set()
        const messages = [...chatHistory.messages, userMsg, aiMsg];
        chatHistory.messages = messages;
        await chatHistory.save();
    }

    res.status(httpStatus.OK).send({
        reply: aiReply.text,
        tokens: aiReply.tokensUsed,
        weatherContextApplied: !!weatherWarning,
        audioUrl: aiReply.audioUrl,
        detectedLanguage: aiReply.detectedLanguage,
        isAnalysis: !!file,
        analysisData: file ? aiReply.analysis : null
    });
});

const generateReport = catchAsync(async (req, res) => {
    const chatHistory = await ChatHistory.findOne({ where: { userId: req.user.id } });
    if (!chatHistory || !chatHistory.messages.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'No chat history found to generate report');
    }

    const report = await reportService.generateChatReport(req.user.id, chatHistory.messages);
    res.status(httpStatus.OK).send(report);
});


module.exports = {
    chat,
    getHistory,
    generateReport
};
