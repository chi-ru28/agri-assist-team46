const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        shopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ['fertilizer', 'pesticide', 'tool'],
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['organic', 'chemical'],
            index: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            index: true,
        },
        unit: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Compound index to help search specific available item types per shop
productSchema.index({ shopId: 1, category: 1, type: 1, stock: -1 });

module.exports = mongoose.model('Product', productSchema);
