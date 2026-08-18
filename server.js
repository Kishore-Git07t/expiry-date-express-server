require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const connectDB = require('./src/config/db');
const setupSwagger = require('./src/config/swagger');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Global Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Setup Swagger API Documentation
setupSwagger(app);

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Base Route / Health Check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Expiry Date Manager Express Server is up and running!',
        port: PORT
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
