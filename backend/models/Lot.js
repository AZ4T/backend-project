const mongoose = require('mongoose');
const { getFormattedDateTime } = require('../tools/dateGetter');

const lotSchema = new mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    photo: { type: String, required: true },
    billOption: { type: String, required: true },
    information: { type: String, required: false },
    createdAt: { type: String, default: getFormattedDateTime() }
});

module.exports = mongoose.model('Lot', lotSchema);