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


// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db.js');
// require('dotenv').config();

// // Sabhi Routes ko upar hi import karein
// const MovieRoute = require('./routes/MovieRoute.js');
// const AuthRoute = require('./routes/AuthRoute.js');

// const app = express();

// // Database connection
// connectDB();

// // Middlewares
// app.use(cors()); 
// app.use(express.json()); 

// // Routes mapping
// app.use('/api/movies', MovieRoute);
// app.use('/api/auth', AuthRoute);

// // Test Route
// app.get('/', (req, res) => {
//     res.send('Cinex Backend API is running...');
// });

// // Server Start
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// abhi ka hi 
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer'); // 1. Nodemailer add kiya
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

// --- OTP SYSTEM START ---

// Email bhejne wala setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Tera Gmail (.env se)
        pass: process.env.EMAIL_PASS  // Tera 16-letter App Password (.env se)
    }
});

// Kisi bhi Gmail par OTP bhejne ka Route
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body; // Frontend se aane wala kisi ka bhi email
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit random OTP

    const mailOptions = {
        from: `"Cinex Movies" <${process.env.EMAIL_USER}>`,
        to: email, // Jisne input dala usko jayega
        subject: 'Cinex Ticket Booking OTP',
        text: `Bhai, ticket book karne ke liye tera OTP ye raha: ${otp}. Kise ko batana mat!`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to: ${email}`);
        res.status(200).json({ success: true, message: 'OTP bhej diya gaya hai!', otp: otp });
    } catch (error) {
        console.error("Email error: ", error);
        res.status(500).json({ success: false, message: 'Email bhejne mein galti hui' });
    }
});

// --- OTP SYSTEM END ---

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