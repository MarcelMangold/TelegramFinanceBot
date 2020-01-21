import { DatabaseConnection } from "./databaseConnection";

export interface Config
{
    databaseConnection:DatabaseConnection;
    botToken:string;
}