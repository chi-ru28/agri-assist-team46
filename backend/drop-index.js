const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agriassist').then(async () => {
    try {
        await mongoose.connection.collection('users').dropIndex('email_1');
        console.log('Successfully dropped email_1 index');
    } catch (err) {
        console.error('Error dropping index:', err.message);
    }
    process.exit(0);
});
