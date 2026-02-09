const express = require('express');
const { getMovies } = require('../controllers/MovieController');
const router = express.Router();

// Jab koi GET request karega /api/movies pe
router.post('/', getMovies);

module.exports = router;