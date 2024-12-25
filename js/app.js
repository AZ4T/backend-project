const express = require('express');
const path = require('path'); // Required for working with file paths

const app = express();
const port = 3000;

// Middleware to serve static files (e.g., CSS and images)
app.use('/styles', express.static(path.join(__dirname, '..', 'styles')));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// Route to serve the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'index.html'));
});


app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'about.html'));
});


app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'account.html'));
});


app.get('/auction', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'auction.html'));
});


app.get('/lot', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'lot.html'));
});

// Catch-all route for undefined paths (404 Not Found)
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
