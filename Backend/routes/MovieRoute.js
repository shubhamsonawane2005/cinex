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

// Add Movie
router.post('/', async(req, res) => {
    const newMovie = new Movie({
        ...req.body,
        status: 'released'
    });
    await newMovie.save();
    res.status(201).json(newMovie);
})

router.post('/upcoming', async(req, res) => {
    // Assuming your 'Movie' model has a 'status' field to differentiate
    const newUpcomingMovie = new Movie({
        ...req.body,
        status: 'upcoming' // Ensure it's marked as upcoming
    });
    await newUpcomingMovie.save();
    res.status(201).json(newUpcomingMovie);
});

router.get('/upcoming', async(req, res) => {
    const upcomingMovies = await Movie.find({ status: 'upcoming' });
    res.json(upcomingMovies);
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