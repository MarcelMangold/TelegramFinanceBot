"use strict";
exports.__esModule = true;
require('dotenv').config(); //instatiate environment variables
var databaseConnection = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT)
};
exports.databaseConnection = databaseConnection;
var botToken = process.env.BOT_TOKEN;
exports.botToken = botToken;
