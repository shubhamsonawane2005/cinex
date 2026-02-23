const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
 movieTitle: { type: String, required: true },
  theaterName: { type: String, required: true },
  userEmail: { type: String, required: true }, // Email zaroori hai
  userName: { type: String, required: true },  // <--- Ise String rakhein, ObjectId nahi
  showTime: { type: String, required: true },
  seats: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Paid' },
  bookingId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MovieTicket', bookingSchema);