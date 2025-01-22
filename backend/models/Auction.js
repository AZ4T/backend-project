const mongoose = require('mongoose');
const { getFormattedDateTime } = require('../tools/dateGetter');

const auctionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    start: { type: String, required: true },
    createdAt: { type: String, default: getFormattedDateTime() }
});

module.exports = mongoose.model('Auction', auctionSchema);