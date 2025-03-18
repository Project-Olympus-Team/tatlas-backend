const express = require('express');
const app = express();
const pool = require('./config/db');
const morgan = require('morgan');
const cors = require('cors');

// middleware eklemece
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// test route, ana sayfa
app.get('/', (req, res) => {
    console.log('Homepage');
    res.send('Test 1234')
});

// auth işleme yönlendirmece
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// server bağlantısı
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);

    pool.query('SELECT NOW()', (err) => {
        if (err) console.log('Database connection error:', err);
        else console.log('Database connected');
    });
});