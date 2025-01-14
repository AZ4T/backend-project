const mongoose = require('mongoose');

const lotSchema = new mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    photo: { type: String, required: true },
    billOption: { type: String, required: true },
    information: { type: String, required: false },
    createdAt: { type: String, default: Date.now }
});

module.exports = mongoose.model('Lot', lotSchema);