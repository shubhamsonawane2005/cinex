const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer'); // 1. Nodemailer add kiya
const connectDB = require('./config/db.js');
require('dotenv').config();


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
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

// Kisi bhi Gmail par OTP bhejne ka Route
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body; // Frontend se aane wala kisi ka bhi email
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 digit random OTP

    const otpMessage = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eeeeee; border-radius: 12px; padding: 25px; color: #333333; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #e50914; margin: 0; font-size: 28px;">CINEX</h1>
        </div>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">Thank you for choosing <strong>Cinex</strong>. Use the following OTP to complete your registration process:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; background-color: #f8f9fa; border: 1px dashed #cccccc; padding: 15px 30px; border-radius: 8px; color: #000000; display: inline-block;">
                ${otp}
            </span>
        </div>
        
        <p style="font-size: 14px; color: #777777;">This OTP is valid for the next <strong>5 minutes</strong>. For security reasons, do not share this code with anyone.</p>
        
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 25px 0;">
        
        <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
            If you did not request this code, please ignore this email.<br>
            &copy; 2026 Cinex Support Team
        </p>
    </div>
`;

    const mailOptions = {
        from: `"Cinex Movies" <${process.env.EMAIL_USER}>`,
        to: email, 
        subject: `Cinex: ${otp} is your verification code`,
        // text: `Bhai, ticket book karne ke liye tera OTP ye raha: ${otp}. Kise ko batana mat!`
        html: otpMessage
    };
    res.status(200).json({ 
        message: "OTP process started", 
        otp: otp 
    });

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