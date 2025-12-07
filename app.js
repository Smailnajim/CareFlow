require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./Route/api');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const logger = require('./Utils/Logger');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

const cors = require('cors');

// Add this BEFORE your routes
app.use(cors({
    origin: 'http://localhost:5173',  // Vite's default port
    credentials: true
}));
// app.use(cors());

app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    },
    skip: req => req.method == 'GET'
}));

app.get('/', (req, res) => {
    return res.send('app work');
});

app.use('/api', routes);

module.exports = app;
