import { databaseConnection } from '../config/config';
import {logger} from './logger';
import { Pool, Client } from 'pg';
const pool = new Pool(databaseConnection)

let executeQuery = function (text, values) {
    const client = new Client(databaseConnection);
    return new Promise(async (resolve, reject) => {
        try {
            await client.connect();
            const res = await client.query(text, values);
            await client.end();
            resolve(res);
        } catch (err) {
            logger.error('executePreparedStatement: ' + JSON.stringify(err) + ' - queryConfig:' + text + "- values:" + values);
            reject(err + ', SQL-Statement: ' + text);
        }
    });
};


export {executeQuery};