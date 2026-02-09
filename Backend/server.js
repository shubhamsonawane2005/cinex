const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

require('dotenv').config(); // .env file se variables load karne ke liye
const MovieRoute = require('./routes/MovieRoute.js');

const app = express();
connectDB();

// Middlewares
app.use(cors()); // Frontend aur Backend ke beech communication ke liye
app.use(express.json()); // JSON data handle karne ke liye
app.use('/api/movies' , MovieRoute)

// Basic Route (Test karne ke liye)
app.get('/', (req, res) => {
    res.send('Cinex Backend API is running...');
});


// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});