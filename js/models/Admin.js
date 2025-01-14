const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    createdAt: { type: String, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);