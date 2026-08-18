const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log(`[DB] MONGODB_URI configured: ${!!process.env.MONGODB_URI}`);
        const conn = await mongoose.connect(
            process.env.MONGODB_URI,
            { serverSelectionTimeoutMS: 3000 }
        );

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
    }
};

module.exports = connectDB;