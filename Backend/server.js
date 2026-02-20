
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer'); 
const connectDB = require('./config/db.js');
require('dotenv').config();

const MovieRoute = require('./routes/MovieRoute.js');
const AuthRoute = require('./routes/AuthRoute.js');
const TicketRoute = require('./routes/TicketRoutes.js');

const app = express();

// Database connection
connectDB();

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// --- EMAIL SETUP ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

// --- OTP SYSTEM START ---
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body; 
    const otp = Math.floor(100000 + Math.random() * 900000); 

    const otpMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eeeeee; padding: 25px; border-radius: 12px;">
        <div style="text-align: center;">
            <h1 style="color: #e50914;">CINEX</h1>
        </div>
        <p>Your verification code is:</p>
        <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; background: #f4f4f4; padding: 10px 20px; border-radius: 8px; letter-spacing: 5px;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #777;">Valid for 5 minutes only.</p>
    </div>`;

    const mailOptions = {
        from: `"Cinex Movies" <${process.env.EMAIL_USER}>`,
        to: email, 
        subject: `Cinex Verification Code: ${otp}`,
        html: otpMessage
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to: ${email}`);
        return res.status(200).json({ success: true, message: 'OTP sent successfully!', otp: otp });
    } catch (error) {
        console.error("Email error: ", error);
        return res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
});
// --- OTP SYSTEM END ---

// --- NOTIFY ME SYSTEM (Subham's Task) ---
app.post('/api/notify-me', async (req, res) => {
    const { email, movieName } = req.body;

    const notifyMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eeeeee; padding: 25px; border-radius: 12px;">
        <h1 style="color: #e50914; text-align: center;">CINEX</h1>
       <h3>Great News!</h3>
        <p>We have noted your interest for <strong>${movieName}</strong>.</p>
        <p>As soon as tickets open, you will be the first to be notified!</p>
        <hr>
        <p style="font-size: 12px;">Team Cinex 2026</p>
    </div>`;

    const mailOptions = {
        from: `"Cinex Movies" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Notification Set: ${movieName}`,
        html: notifyMessage
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification set for: ${email} for movie: ${movieName}`);
        return res.status(200).json({ success: true, message: 'Bhai notification set ho gaya!' });
    } catch (error) {
        console.error("Notification Error:", error);
        return res.status(500).json({ success: false, message: 'Error setting notification' });
    }
});

// Routes mapping
app.use('/api/movies', MovieRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/bookings', TicketRoute);

// Test Route
app.get('/', (req, res) => {
    res.send('Cinex Backend API is running...');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});