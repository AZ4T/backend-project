const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { auth } = require('./middleware/auth');
const dbCheck = require('./middleware/dbCheck');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const lotRoutes = require('./routes/lotRoutes');

const cookieParser = require("cookie-parser");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());

//static files
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../backend')));

//routes
app.use(dbCheck);
app.use('/api/middleware/auth', auth);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lot', lotRoutes);

app.use(cors({
    origin: 'http://localhost:3000', // Укажите адрес фронтенда
    credentials: true
}));


app.get('/admin', auth, (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('You are not allowed to access this resource');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'Admin') {
            return res.status(404).sendFile(path.join(__dirname, '../frontend/pages/404.html'));
        }
        next();
    } catch (error) {
        res.status(401).send('Invalid token', error.name, error.message);
    }
});

//page catching
app.use('/:page', (req, res, next) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, `../frontend/pages/${page}.html`);
    res.sendFile(filePath, err => {
        if (err) next();
    });
});

//404
app.use((req, res) => {
    if (req.accepts('html')) {
        res.status(404).sendFile(path.join(__dirname, '../frontend/pages/404.html'));
        return;
    }
    res.status(404).json({ msg: 'Not Found' });
});

//database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//starting the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/account`);
});