const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    availableDay: {
        type: String,
        required: true
    },
    totalSlots: {
        type: Number,
        required: true
    },
    availableSlots: {
        type: Number,
        required: true
    },
    nextAvailableDate: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Department', departmentSchema); 