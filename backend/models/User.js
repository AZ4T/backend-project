const mongoose = require('mongoose');
const { getFormattedDateTime } = require('../tools/dateGetter');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true },
    createdAt: { type: String, default: getFormattedDateTime() }
});

module.exports = mongoose.model('User', userSchema);