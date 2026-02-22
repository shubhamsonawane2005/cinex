
const express = require('express');
const MovieTicket = require('../models/MovieTicket'); // Path ek baar check kar lena
const router = express.Router();

// POST: Save new booking
router.post('/save', async (req, res) => {
    try {
        console.log("--- New Booking Request ---");
        console.log("Data Received:", req.body); 

        // Check if userEmail exists
        if (!req.body.userEmail) {
            console.log("Error: User Email missing!");
            return res.status(400).json({ success: false, message: "User Email is required" });
        }
        
        // Data ko model mein daalna
        const newBooking = new MovieTicket(req.body);
        
        // Database mein save karna
        const savedBooking = await newBooking.save(); 
        
        console.log("Success! Saved to DB with ID:", savedBooking._id);
        res.status(200).json({ success: true, data: savedBooking });
    } catch (error) {
        console.error("CRITICAL SAVE ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- GET: User ki bookings email se ---
router.get('/my-bookings/:email', async (req, res) => {
    try {
        const email = req.params.email.trim(); 
        console.log("Fetching bookings for:", email);
        
        const bookings = await MovieTicket.find({ 
            userEmail: { $regex: new RegExp("^" + email + "$", "i") } 
        }).sort({ createdAt: -1 });

        console.log(`Found ${bookings.length} bookings`);
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// --- DELETE: Booking cancel ---
router.delete('/cancel/:id', async (req, res) => {
    try {
        const result = await MovieTicket.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ success: false, message: "Ticket not found" });
        
        console.log("Deleted Ticket ID:", req.params.id);
        res.status(200).json({ success: true, message: "Ticket Cancelled Successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Cancellation Failed" });
    }
});

// GET: Total Count
router.get('/count', async (req, res) => {
    try {
        const count = await MovieTicket.countDocuments();
        res.status(200).json({ success: true, count: count });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// GET: Stats for Admin Dashboard
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