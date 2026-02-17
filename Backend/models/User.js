const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    googleId: { type: String, unique: true, sparse: true }, 
    profilePic: { type: String },
    authType: { type: String, default: 'local' }
},{timestamps: true});

module.exports = mongoose.model('User', UserSchema);