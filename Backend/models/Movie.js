const { required } = require('@angular/forms/signals');
const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String ,required: true},
    image: { type: String, required: true},
    status: { 
        type: String, 
        enum: ['released', 'upcoming'], 
        default: 'released'              
    }
    // year: { type: Number, required: true },
    // description: String,
    // rating: Number
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);