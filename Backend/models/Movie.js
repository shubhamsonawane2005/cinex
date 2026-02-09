const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    year: { type: Number, required: true },
    description: String,
    rating: Number
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);