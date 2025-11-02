require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('./Models/Role');
const MailService = require('./Services/MailService');
const logger = require('./Utils/Logger');
const app = require('./app');

mongoose.connect(process.env.URL_TO_CONNECT)
    .then(() => console.log('\nconect\n'))
    .then(() => { return Role.find() })
    .then((res) => console.log(res))
    .catch(error => console.log('\nthere is error\n', error));

MailService.autoMails();

app.listen(3000, () => logger.info('work on http://localhost:3000'));
