const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'MY_SECRET', { expiresIn: '1h' });
};

// --- SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User Registered Successfully!' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'Server error occurred during signup' });
  }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- GOOGLE LOGIN ROUTE ---
router.post('/google-login', async (req, res) => {
  try {
    const { username, email, googleId } = req.body;
    let user = await User.findOne({ email });

    // If user exists, log them in
    if (user) {
      const token = generateToken(user._id);
      return res.status(200).json({
        token,
        user: { id: user._id, username: user.username, email: user.email },
        message: 'Google Login Successful',
      });
    }

    // If user doesn't exist, create new record
    const dummyPassword = await bcrypt.hash(googleId + 'GOOGLE_AUTH', 10);
    const newUser = new User({ username, email, password: dummyPassword });
    await newUser.save();

    const token = generateToken(newUser._id);
    res.status(201).json({
      token,
      user: { id: newUser._id, username: newUser.username, email: newUser.email },
      message: 'User Registered via Google!',
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ error: 'Google data saving failed' });
  }
});

// --- PROFILE ROUTES ---

// Get User Details
router.get('/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Profile
router.put('/update-profile/:email', async (req, res) => {
  try {
    const { username, phone } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: { username, phone } },
      { returnDocument: 'after' }, // Returns the updated doc and removes Mongoose warnings
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN / STATS ---

router.get('/user-count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
