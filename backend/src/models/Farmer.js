const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Farmer = sequelize.define('Farmer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
    },
    landSize: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    address: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    location: {
        type: DataTypes.JSONB, // Storing { type: 'Point', coordinates: [lng, lat] }
        defaultValue: { type: 'Point', coordinates: [0, 0] },
    }
}, { timestamps: true });

module.exports = Farmer;
