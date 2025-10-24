    require('dotenv').config();
    const express = require('express');
    const path = require('path');
    const mongoose = require('mongoose');
    const routes = require('./Route/api');
    const Role = require('./Models/Role');
    const cookieParser = require('cookie-parser');
    const MailService = require('./Services/MailService');
    const morgan = require('morgan');
    const fs = require('fs');
    const winston = require('winston');


    const app = express();



    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));



    app.use(express.static('public'));
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(cookieParser());



//winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY:MM:DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message} PLACE: ${__filename}`)
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: path.join(__dirname, 'Logs/error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(__dirname, 'Logs/info.log')}),
    ]
});


    //morgan
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    },
    skip: req => req.method == 'GET'
}));



    mongoose.connect(process.env.URL_TO_CONNECT)
    .then(()=>console.log('\nconect\n'))
    .then(()=>{return Role.find()})
    .then((res)=>console.log(res))
    .catch(error => console.log('\nthere is error\n', error));

    app.use('/api', routes);
    MailService.autoMails();


    app.listen(3000, ()=>logger.info());