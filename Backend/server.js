// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db.js');

// require('dotenv').config(); // .env file se variables load karne ke liye
// const MovieRoute = require('./routes/MovieRoute.js');

// const app = express();
// connectDB();

// // Middlewares
// app.use(cors()); // Frontend aur Backend ke beech communication ke liye
// app.use(express.json()); // JSON data handle karne ke liye
// app.use('/api/movies' , MovieRoute)

// // Basic Route (Test karne ke liye)
// app.get('/', (req, res) => {
//     res.send('Cinex Backend API is running...');
// });


// // ... baaki imports ke saath ye add karein
// const AuthRoute = require('./routes/AuthRoute.js');

// // Middlewares ke neeche ye line add karein
// app.use('/api/auth', AuthRoute);


// // Server Start
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// 15 co de add kiya


const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
require('dotenv').config();

// Sabhi Routes ko upar hi import karein
const MovieRoute = require('./routes/MovieRoute.js');
const AuthRoute = require('./routes/AuthRoute.js');

const app = express();

// Database connection
connectDB();

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// Routes mapping
app.use('/api/movies', MovieRoute);
app.use('/api/auth', AuthRoute);

// Test Route
app.get('/', (req, res) => {
    res.send('Cinex Backend API is running...');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});