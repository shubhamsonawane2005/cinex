const express = require('express');
const MovieTicket = require('../models/MovieTicket');
const router = express.Router();

// --- POST: Save new booking ---
router.post('/save', async (req, res) => {
  try {
    console.log('--- New Booking Request ---');

    // 1. Validation check
    if (!req.body.userEmail || !req.body.movieTitle) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userEmail and movieTitle are mandatory.',
      });
    }

    // 2. Create object with explicit mapping for safety
    const newBooking = new MovieTicket({
      movieTitle: req.body.movieTitle,
      theaterName: req.body.theaterName,
      userEmail: req.body.userEmail,
      userName: req.body.userName,
      showTime: req.body.showTime,
      showDate: req.body.showDate,
      seats: req.body.seats,
      totalAmount: Number(req.body.totalAmount) || 0,
      paymentStatus: req.body.paymentStatus || 'Paid',
      bookingId: req.body.bookingId || 'BKT-' + Date.now(),
    });

    // 3. Save to Database
    const savedBooking = await newBooking.save();

    console.log('Success! Saved to DB with ID:', savedBooking._id);
    res.status(200).json({ success: true, data: savedBooking });
  } catch (error) {
    console.error('CRITICAL SAVE ERROR:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Data format galat hai!',
        details: error.message,
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- GET: Fetch user bookings by email (Case Insensitive) ---
router.get('/my-bookings/:email', async (req, res) => {
  try {
    const email = req.params.email.trim();
    console.log('Fetching bookings for:', email);

    // Using regex to make the search case-insensitive
    const bookings = await MovieTicket.find({
      userEmail: { $regex: new RegExp('^' + email + '$', 'i') },
    }).sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Fetch Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- DELETE: Cancel booking ---
router.delete('/cancel/:id', async (req, res) => {
  try {
    const result = await MovieTicket.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    console.log('Deleted Ticket ID:', req.params.id);
    res.status(200).json({ success: true, message: 'Ticket Cancelled Successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Cancellation Failed' });
  }
});

// --- GET: Total Booking Count ---
router.get('/count', async (req, res) => {
  try {
    const count = await MovieTicket.countDocuments();
    res.status(200).json({ success: true, count: count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- GET: Stats for Admin Dashboard with Pagination ---
router.get('/stats', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Fetch total count and revenue in parallel
    const [total, revenueData] = await Promise.all([
      MovieTicket.countDocuments(),
      MovieTicket.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    ]);

    const bookings = await MovieTicket.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'userEmail',
          foreignField: 'email',
          as: 'userDetails',
        },
      },
      {
        $addFields: {
          userName: { $arrayElemAt: ['$userDetails.username', 0] },
        },
      },
      {
        $project: { userDetails: 0 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: bookings,
      totalBookings: total,
      totalRevenue: revenueData.length > 0 ? revenueData[0].total : 0,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- GET: Fetch already booked seats for a specific show ---
router.get('/booked-seats', async (req, res) => {
  try {
    const { movie, theater, date, time } = req.query;

    console.log(`\n🔍 Checking bookings for: ${movie} at ${theater} (${time})`);

    const bookings = await MovieTicket.find({
      movieTitle: movie,
      theaterName: theater,
      showTime: time,
      showDate: date,
    });

    let bookedSeatsArray = [];
    bookings.forEach((booking) => {
      if (booking.seats) {
        const individualSeats = booking.seats.split(', ');
        bookedSeatsArray = [...bookedSeatsArray, ...individualSeats];
      }
    });

    console.log('========================================');
    console.log(`✅ TOTAL BOOKED SEATS FOUND: ${bookedSeatsArray.length}`);
    console.log(`💺 SEAT LIST: [ ${bookedSeatsArray.join(' | ')} ]`);
    console.log('========================================\n');

    res.status(200).json(bookedSeatsArray);
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ success: false, message: 'Could not fetch seats' });
  }
});

module.exports = router;
