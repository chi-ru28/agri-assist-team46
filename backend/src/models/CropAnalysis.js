const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CropAnalysis = sequelize.define('CropAnalysis', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    farmerId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
    deficiency: {
        type: DataTypes.STRING,
    },
    severity: {
        type: DataTypes.STRING,
    },
    recommendation: {
        type: DataTypes.JSONB, // { fertilizer, dosagePerAcre, precautions }
    },
    healthScore: {
        type: DataTypes.FLOAT,
    },
    mlConfidence: {
        type: DataTypes.FLOAT,
    }
}, { timestamps: true });

module.exports = CropAnalysis;
