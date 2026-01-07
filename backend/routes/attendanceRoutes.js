const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Mark Attendance
router.post('/', async (req, res) => {
  try {
    const { memberId } = req.body;
    // Check if already marked today to prevent duplicates
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    
    const existing = await Attendance.findOne({ 
      memberId, 
      createdAt: { $gte: startOfDay } 
    });

    if (existing) return res.status(400).json({ message: 'Already marked present today' });

    await Attendance.create({ memberId });
    res.json({ message: 'Marked Present' });
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

// Get Attendance for a specific Member
router.get('/:memberId', async (req, res) => {
  try {
    const logs = await Attendance.find({ memberId: req.params.memberId }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;