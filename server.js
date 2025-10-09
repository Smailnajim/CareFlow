require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

app.use(express.urlencoded({extended: true}));
app.use(express.json());

mongoose.connect(process.env.URL_TO_CONNECT)
.then(()=>console.log('\nconsole\n'))
.catch(error => console.log('\nthere is error\n', error));