const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    department: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    appointmentDate: {
        type: String,
        required: true
    },
    bookingDate: {
        type: String,
        required: true
    },
    bookingDay: {
        type: String,
        required: true
    },
    bookingTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema); 