const express = require('express');
const router = express.Router();
const Department = require('../models/Department');

// Get all departments
router.get('/', async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (error) {
        console.error('Get departments error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get department by name
router.get('/:name', async (req, res) => {
    try {
        const department = await Department.findOne({ name: req.params.name });
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(department);
    } catch (error) {
        console.error('Get department error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update department (admin only)
router.put('/:id', async (req, res) => {
    try {
        const { availableSlots, nextAvailableDate } = req.body;
        const department = await Department.findById(req.params.id);

        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        department.availableSlots = availableSlots;
        department.nextAvailableDate = nextAvailableDate;
        await department.save();

        res.json(department);
    } catch (error) {
        console.error('Update department error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 