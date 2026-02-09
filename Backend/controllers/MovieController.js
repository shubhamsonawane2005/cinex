const Movie = require('../models/Movie');

// Ye function saari movies ki list bhejega
const getMovies = (req, res) => {
    res.status(200).json([
        { id: 1, title: "Inception", year: 2010 },
        { id: 2, title: "Interstellar", year: 2014 }
    ]);
};

// Nayi movie add karne ke liye (POST request)
const addMovie = async (req, res) => {
    try {
        const { title, year, description, rating } = req.body;
        const newMovie = await Movie.create({ title, year, description, rating });
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { addMovie };

module.exports = { getMovies };