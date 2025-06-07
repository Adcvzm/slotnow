const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Department = require('../models/Department');
const auth = require('../middleware/auth');

// Get all bookings (admin only)
router.get('/', auth, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new booking
router.post('/', async (req, res) => {
    try {
        const { department, name, mobile, age, address, appointmentDate } = req.body;

        // Check department availability
        const dept = await Department.findOne({ name: department });
        if (!dept || dept.availableSlots <= 0) {
            return res.status(400).json({ message: 'No slots available for this department' });
        }

        // Create booking
        const booking = new Booking({
            department,
            name,
            mobile,
            age,
            address,
            appointmentDate,
            bookingDate: new Date().toLocaleDateString('en-US'),
            bookingDay: new Date().toLocaleDateString('en-US', { weekday: 'long' }),
            bookingTime: new Date().toLocaleTimeString('en-US')
        });

        await booking.save();

        // Update department slots
        dept.availableSlots -= 1;
        await dept.save();

        res.status(201).json(booking);
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete booking (admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Update department slots
        const dept = await Department.findOne({ name: booking.department });
        if (dept) {
            dept.availableSlots += 1;
            await dept.save();
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking deleted' });
    } catch (error) {
        console.error('Delete booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Check for duplicate booking
router.post('/check-duplicate', async (req, res) => {
    try {
        const { mobile, department } = req.body;
        const booking = await Booking.findOne({ mobile, department });
        res.json({ exists: !!booking });
    } catch (error) {
        console.error('Check duplicate error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 