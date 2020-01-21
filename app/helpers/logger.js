"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const logFormat = winston.format.printf((info) => {
    return `[${info.timestamp}] ${info.level}: ${info.message}`;
});
winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    debug: 'green'
});
let logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat)
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            level: 'info',
        }),
        new winston.transports.File({
            filename: 'logs/errors.log',
            level: 'error'
        })
    ],
});
module.exports = logger;
