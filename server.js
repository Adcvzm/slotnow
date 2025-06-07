const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Enhanced request logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// CORS configuration with specific options
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the backend/public directory
app.use(express.static(path.join(__dirname, 'backend', 'public')));

// MongoDB Connection with retry logic
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    process.exit(1);
}

const connectWithRetry = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('Connected to MongoDB Atlas successfully');
        console.log('Database:', mongoose.connection.db.databaseName);
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

connectWithRetry();

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ 
        success: false,
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// API Routes
console.log('Setting up API routes...');
const routesPath = path.join(__dirname, 'routes');

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('/api/auth', require(path.join(routesPath, 'auth')));
app.use('/api/bookings', require(path.join(routesPath, 'bookings')));
app.use('/api/departments', require(path.join(routesPath, 'departments')));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'backend', 'public', 'index.html'));
});

// Handle 404 errors
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.url);
    res.status(404).json({ 
        success: false,
        message: 'Not Found',
        path: req.url,
        method: req.method
    });
});

// Use Render's port or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('API URL:', `http://localhost:${PORT}/api`);
}); 
