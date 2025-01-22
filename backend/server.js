const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const lotRoutes = require('./routes/lotRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

//static files
app.use(express.static(path.join(__dirname, '../frontend')));

//routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lot', lotRoutes);


// app.use('/admin', (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).send('You are not allowed to access this resource');

//     try {
//         const decoded = jwt.verify(token, 'SECRET_KEY');
//         if (decoded.role !== 'admin') {
//             return res.status(403).send('Forbidden');
//         }
//         // user is admin, proceed
//         next();
//     } catch (error) {
//         res.status(401).send('Invalid token');
//     }
// });

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