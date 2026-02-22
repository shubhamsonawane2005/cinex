// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// // SIGNUP ROUTE
// router.post('/signup', async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         // 1. Check karo user pehle se toh nahi hai
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: "Email already exists" });
//         }

//         // 2. Password ko hash karein
//         const hashedPassword = await bcrypt.hash(password, 10);
        
//         // 3. Naya user banayein
//         const newUser = new User({ 
//             username, 
//             email, 
//             password: hashedPassword 
//         });

//         await newUser.save();
//         console.log("User saved:", username); // Terminal mein dikhega
//         res.status(201).json({ message: "User Registered Successfully!" });

//     } catch (err) {
//         console.error("Signup Error Detail:", err); // Isse terminal mein asli error dikhega
//         res.status(500).json({ error: "Server error occurred during signup" });
//     }
// });

// // LOGIN ROUTE
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
        
//         // Email check
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ message: "User not found" });

//         // Password compare
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

//         // Token banayein
//         const token = jwt.sign(
//             { id: user._id }, 
//             process.env.JWT_SECRET || 'MY_SECRET', 
//             { expiresIn: '1h' }
//         );

//         res.status(200).json({ 
//             token, 
//             user: { id: user._id, username: user.username } 
//         });
//     } catch (err) {
//         console.error("Login Error:", err);
//         res.status(500).json({ error: err.message });
//     }
// });

// router.post('/google-login', async (req, res) => {
//     try {
//         const { username, email, googleId, profilePic } = req.body;

//         // 1. Check karein ki user pehle se hai ya nahi
//         let user = await User.findOne({ email });

//         if (user) {
//             // Agar user mil gaya, toh bas token bhej dein (Login)
//             const token = jwt.sign(
//                 { id: user._id }, 
//                 process.env.JWT_SECRET || 'MY_SECRET', 
//                 { expiresIn: '1h' }
//             );

//             return res.status(200).json({ 
//                 token, 
//                 user: { id: user._id, username: user.username },
//                 message: "Google Login Successful"
//             });
//         }

        
//         const dummyPassword = await bcrypt.hash(googleId + "GOOGLE_AUTH", 10);

//         const newUser = new User({ 
//             username, 
//             email, 
//             password: dummyPassword 
//         });

//         await newUser.save();
        
//         // Token banayein naye user ke liye
//         const token = jwt.sign(
//             { id: newUser._id }, 
//             process.env.JWT_SECRET || 'MY_SECRET', 
//             { expiresIn: '1h' }
//         );

//         res.status(201).json({ 
//             token, 
//             user: { id: newUser._id, username: newUser.username },
//             message: "User Registered via Google!" 
//         });

//     } catch (err) {
//         console.error("Google Auth Error:", err);
//         res.status(500).json({ error: "Google data saving failed" });
//     }
// });

// // total user count
// router.get('/user-count', async (req, res) => {
//   try {
//     // .countDocuments() function total records count karta hai
//     const count = await User.countDocuments(); 
//     res.json({ count });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword 
        });
        await newUser.save();
        res.status(201).json({ message: "User Registered Successfully!" });
    } catch (err) {
        console.error("Signup Error Detail:", err);
        res.status(500).json({ error: "Server error occurred during signup" });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || 'MY_SECRET', 
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            token, 
            user: { id: user._id, username: user.username, email: user.email } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GOOGLE LOGIN ROUTE
router.post('/google-login', async (req, res) => {
    try {
        const { username, email, googleId } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'MY_SECRET', { expiresIn: '1h' });
            return res.status(200).json({ 
                token, 
                user: { id: user._id, username: user.username, email: user.email },
                message: "Google Login Successful"
            });
        }

        const dummyPassword = await bcrypt.hash(googleId + "GOOGLE_AUTH", 10);
        const newUser = new User({ username, email, password: dummyPassword });
        await newUser.save();
        
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'MY_SECRET', { expiresIn: '1h' });
        res.status(201).json({ 
            token, 
            user: { id: newUser._id, username: newUser.username, email: newUser.email },
            message: "User Registered via Google!" 
        });
    } catch (err) {
        res.status(500).json({ error: "Google data saving failed" });
    }
});

// GET USER DETAILS
router.get('/user/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE PROFILE (Mongoose Warning Fixed Here)
router.put('/update-profile/:email', async (req, res) => {
    try {
        const { username, phone } = req.body;
        const updatedUser = await User.findOneAndUpdate(
            { email: req.params.email },
            { $set: { username, phone } },
            // FIX: Use returnDocument: 'after' instead of new: true to remove warning
            { returnDocument: 'after' } 
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// TOTAL USER COUNT
router.get('/user-count', async (req, res) => {
  try {
    const count = await User.countDocuments(); 
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;