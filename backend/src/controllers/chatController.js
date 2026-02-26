const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const aiService = require('../services/aiService');
const weatherService = require('../services/weatherService');
const ChatHistory = require('../models/ChatHistory');
const Farmer = require('../models/Farmer');
const logger = require('../utils/logger');

const chat = catchAsync(async (req, res) => {
    const { message } = req.body;
    const role = req.user.role;
    let weatherWarning = '';

    if (role === 'farmer') {
        const farmer = await Farmer.findOne({ userId: req.user._id });
        if (farmer) {
            const weather = await weatherService.getWeatherForecast(farmer.address || 'Unknown', farmer.location.coordinates);
            if (weather && weather.rainProbability > 60) {
                weatherWarning = `There is a high chance of rain (${weather.rainProbability}%) in your area.`;
            }
        }
    }

    const aiReply = await aiService.generateChatResponse(role, message, weatherWarning);

    // Update history
    let chatHistory = await ChatHistory.findOne({ userId: req.user._id });
    const userMsg = { role: 'user', content: message };
    const aiMsg = { role: 'ai', content: aiReply.text, tokensUsed: aiReply.tokensUsed };

    if (!chatHistory) {
        await ChatHistory.create({ userId: req.user._id, messages: [userMsg, aiMsg] });
    } else {
        chatHistory.messages.push(userMsg, aiMsg);
        await chatHistory.save();
    }

    res.status(httpStatus.OK).send({
        reply: aiReply.text,
        tokens: aiReply.tokensUsed,
        weatherContextApplied: !!weatherWarning
    });
});

module.exports = {
    chat
};
