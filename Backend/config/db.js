const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // 'cinex_db' aapka database name hoga
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/cinex_db');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;