require('dotenv').config();//instatiate environment variables
import { DatabaseConnection } from '../@types/databaseConnection';
import { Config } from '../@types/config';

let databaseConnection: DatabaseConnection = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT)
}

let config:Config = {
    databaseConnection: databaseConnection,
    botToken:process.env.BOT_TOKEN
}



module.exports = config;