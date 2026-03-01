const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    reply: {
        type: String,
        required: true
    },
    context: {
        type: String,
        enum: ['general', 'weather_warning'],
        default: 'general'
    }
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
