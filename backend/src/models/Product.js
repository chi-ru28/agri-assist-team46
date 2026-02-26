const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        enum: ['fertilizer', 'pesticide', 'tool', 'seed'],
        required: true,
    },
    type: {
        type: String,
        enum: ['organic', 'chemical', 'hardware'],
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Exclude soft-deleted products from general queries
productSchema.pre(/^find/, function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

module.exports = mongoose.model('Product', productSchema);
