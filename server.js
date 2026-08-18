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

// Build allowed origins from environment variables
const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
].filter(Boolean);

// Global Middleware
app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Diagnostic request logging for auth routes
app.use('/auth', (req, res, next) => {
    console.log(`[AUTH] ${req.method} ${req.originalUrl} from origin: ${req.headers.origin || 'N/A'}`);
    next();
});

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
