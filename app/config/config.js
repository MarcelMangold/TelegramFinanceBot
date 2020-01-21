"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config(); //instatiate environment variables
let databaseConnection = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT)
};
let config = {
    databaseConnection: databaseConnection,
    botToken: process.env.BOT_TOKEN
};
module.exports = config;
