const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shop = sequelize.define('Shop', {
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
    shopName: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    address: {
        type: DataTypes.STRING,
        defaultValue: '',
    },
    location: {
        type: DataTypes.JSONB,
        defaultValue: { type: 'Point', coordinates: [0, 0] },
    }
}, { timestamps: true });

module.exports = Shop;
