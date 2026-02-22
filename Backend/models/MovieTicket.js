// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   movieTitle: { type: String, required: true },
//   theaterName: { type: String, required: true },
//   showTime: { type: String, required: true },
//   seats: { type: String, required: true },
//   totalAmount: { type: Number, required: true },
//   paymentStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
//   bookingId: { type: String, unique: true },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Ticket', bookingSchema);
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  movieTitle: { type: String, required: true },
  theaterName: { type: String, required: true },
  showTime: { type: String, required: true },
  seats: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  bookingId: { type: String, unique: true },
  // SABSE ZAROORI: Ye line nahi thi isiliye profile khali thi
  userEmail: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});

// Model ka naam 'MovieTicket' rakhna agar tune routes mein wahi use kiya hai
module.exports = mongoose.model('MovieTicket', bookingSchema);