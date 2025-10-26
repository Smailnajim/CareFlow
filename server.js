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
    const logger = require('./Utils/Logger');


    const app = express();



    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));



    app.use(express.static('public'));
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());
    app.use(cookieParser());



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

    app.get('/', (req, res)=>{
        return res.send('app work');
    });
    app.use('/api', routes);
    MailService.autoMails();


    app.listen(3000, ()=>logger.info('work on http://localhost:3000'));