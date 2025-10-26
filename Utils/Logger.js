const winston = require('winston');
const path = require('path');

//    winston
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



module.exports = logger;