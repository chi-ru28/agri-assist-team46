const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        private: true, // used by custom plugins if needed, else manually exclude
    },
    role: {
        type: String,
        enum: ['farmer', 'shopkeeper', 'admin'],
        required: true,
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true });

// Check if password match
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
};

// Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

// Remove sensitive info when returning JSON
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.refreshToken;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
