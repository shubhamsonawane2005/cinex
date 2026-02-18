const express = require('express');
const MovieTicket = require('../models/MovieTicket');
const router = express.Router();

// POST: Save new booking
router.post('/save', async (req, res) => {
    try {
        const newBooking = new MovieTicket(req.body);
        const savedBooking = await newBooking.save(); // Store result
        res.status(200).json({ success: true, data: savedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;