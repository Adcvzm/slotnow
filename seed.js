const mongoose = require('mongoose');
const User = require('./models/User');
const Department = require('./models/Department');
require('dotenv').config();

// Log environment variables (without sensitive data)
console.log('Environment variables loaded:', {
    MONGODB_URI_EXISTS: !!process.env.MONGODB_URI,
    MONGODB_URI_STARTS_WITH: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'not set'
});

// Sample department data
const departments = [
    {
        name: 'Neurosurgeon',
        availableDay: 'Wednesday',
        totalSlots: 10,
        availableSlots: 10,
        nextAvailableDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    },
    {
        name: 'Neurophysician',
        availableDay: 'Friday',
        totalSlots: 20,
        availableSlots: 20,
        nextAvailableDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    },
    {
        name: 'Cardiology',
        availableDay: 'Tuesday',
        totalSlots: 70,
        availableSlots: 70,
        nextAvailableDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    },
    {
        name: 'Pediatric Cardiology',
        availableDay: 'Friday',
        totalSlots: 10,
        availableSlots: 10,
        nextAvailableDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
];

// Admin user data
const adminUser = {
    email: 'tejaswi',
    password: 'bannu',
    role: 'admin'
};

// Seed function
async function seed() {
    try {
        // Check if MONGODB_URI is set
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not set in environment variables');
        }

        // Validate connection string format
        if (!process.env.MONGODB_URI.startsWith('mongodb://') && !process.env.MONGODB_URI.startsWith('mongodb+srv://')) {
            throw new Error('Invalid MongoDB connection string format. Must start with mongodb:// or mongodb+srv://');
        }

        // Connect to MongoDB
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB successfully');

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Department.deleteMany({});

        // Insert admin user
        console.log('Creating admin user...');
        const user = new User(adminUser);
        await user.save();

        // Insert departments
        console.log('Creating departments...');
        await Department.insertMany(departments);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error.message);
        if (error.name === 'MongoParseError') {
            console.error('Please check your MongoDB connection string format in .env file');
            console.error('The connection string should look like: mongodb+srv://username:password@cluster.mongodb.net/database');
        }
        process.exit(1);
    }
}

seed();
