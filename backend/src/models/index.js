const sequelize = require('../config/database');
const User = require('./User');
const ChatHistory = require('./ChatHistory');
const Farmer = require('./Farmer');
const Shop = require('./Shop');
const Product = require('./Product');
const CropAnalysis = require('./CropAnalysis');
const Reminder = require('./Reminder');

// Define Associations
User.hasOne(Farmer, { foreignKey: 'userId', as: 'farmer' });
Farmer.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Shop, { foreignKey: 'userId', as: 'shop' });
Shop.belongsTo(User, { foreignKey: 'userId' });

Shop.hasMany(Product, { foreignKey: 'shopId', as: 'products' });
Product.belongsTo(Shop, { foreignKey: 'shopId' });

User.hasMany(ChatHistory, { foreignKey: 'userId', as: 'chatHistories' });
ChatHistory.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(CropAnalysis, { foreignKey: 'farmerId', as: 'cropAnalyses' });
CropAnalysis.belongsTo(User, { foreignKey: 'farmerId' });

User.hasMany(Reminder, { foreignKey: 'userId', as: 'reminders' });
Reminder.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    User,
    ChatHistory,
    Farmer,
    Shop,
    Product,
    CropAnalysis,
    Reminder
};
