const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieTitle: { type: String, required: true },
  theaterName: { type: String, required: true },
  // userEmail: { type: String , require: true },
  showTime: { type: String, required: true },
  seats: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  bookingId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', bookingSchema);