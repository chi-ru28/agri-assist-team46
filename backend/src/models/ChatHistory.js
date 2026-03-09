const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ChatHistory = sequelize.define('ChatHistory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    messages: {
        type: DataTypes.JSONB, // Using JSONB for messages array
        defaultValue: [],
    }
});

module.exports = ChatHistory;
