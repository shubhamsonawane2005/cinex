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

router.get('/count', async (req, res) => {
    try {
        const count = await MovieTicket.countDocuments();
        res.status(200).json({ success: true, count: count });
    } catch (error) {
        console.error("Count Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get('/stats', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5; 
        const skip = (page - 1) * limit;

        const total = await MovieTicket.countDocuments();
        const revenueData = await MovieTicket.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const bookings = await MovieTicket.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: bookings,  
            totalBookings: total, 
            totalRevenue: revenueData.length > 0 ? revenueData[0].total : 0, 
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


module.exports = router;