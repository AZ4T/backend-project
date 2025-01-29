const mongoose = require('mongoose');
const { getFormattedDateTime } = require('../tools/dateGetter');

const bidSchema = new mongoose.Schema({
    amount: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: String, default: getFormattedDateTime() }
});

module.exports = mongoose.model('Bid', bidSchema);