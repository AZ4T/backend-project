const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use('/styles', express.static(path.join(__dirname, '..', 'styles')));
app.use('/js', express.static(path.join(__dirname, '..', 'js')))
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'account.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'about.html'));
});

app.get('/auction', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'auction.html'));
});

app.get('/lot', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'lot.html'));
});

app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});