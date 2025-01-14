const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    start: { type: String, required: true },
    createdAt: { type: String, default: Date.now }
});

module.exports = mongoose.model('Auction', auctionSchema);