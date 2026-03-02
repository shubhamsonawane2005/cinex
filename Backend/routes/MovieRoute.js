const express = require('express');
const { getMovies } = require('../controllers/MovieController');
const Movie = require('../models/Movie');
const router = express.Router();

// Get All movie
router.get('/', async(req, res) => {
    const movies = await Movie.find({ 
        status: 'released'
    });
    res.json(movies);
})

router.get('/upcoming', async(req, res) => {
    const upcomingMovies = await Movie.find({ status: 'upcoming' });
    res.json(upcomingMovies);
});

router.post('/upcoming', async(req, res) => {
    // Assuming your 'Movie' model has a 'status' field to differentiate
    const newUpcomingMovie = new Movie({
        ...req.body,
        status: 'upcoming' // Ensure it's marked as upcoming
    });
    await newUpcomingMovie.save();
    res.status(201).json(newUpcomingMovie);
});

// Add Movie
router.post('/', async(req, res) => {
    const newMovie = new Movie({
        ...req.body,
        status: 'released'
    });
    await newMovie.save();
    res.status(201).json(newMovie);
})

// get single movie
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.put("/:id", async(req, res) => {
    const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.json(updateMovie);
})

router.delete('/:id', async(req,res) => {
    const deleteMovie = await Movie.findByIdAndDelete(req.params.id);
    res.json({message: "Movie Deleted"});
})


module.exports = router;