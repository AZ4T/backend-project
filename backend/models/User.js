const mongoose = require('mongoose');
const { getFormattedDateTime } = require('../tools/dateGetter');
const { type } = require('express/lib/response');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true },
    balance: { type: String, default: "0" },
    currentSession: { type: String, default: null },
    twoFactorSecret: { type: String },
    twoFactorEnabled: { type: Boolean, default: false },
    tempSecret: { type: String },
    createdAt: { type: String, default: getFormattedDateTime() }
});

module.exports = mongoose.model('User', userSchema);