"use strict";
exports.__esModule = true;
var queries = {
    'INSERT_TRANSACTION': 'INSERT INTO transaction (name,  amount, isPositive, notice, categorieId, userID, chatId) VALUES ($1, $2, $3, $4, $5, $6, $7);',
    'GET_CATEGORIES': 'SELECT * FROM categorie where userId = $1;',
    'CHECK_IF_USER_EXIST': 'SELECT * FROM user_management where id= $1',
    'CHECK_IF_CHAT_EXIST': 'SELECT * FROM chat where id= $1',
    'ADD_CHAT': 'INSERT INTO chat (id) VALUES ($1)',
    'ADD_USER': 'INSERT INTO user_management (id) VALUES ($1)',
    'GET_INCOME_AMOUNT': 'SELECT SUM (amount) as sum FROM TRANSACTION  WHERE userId = $1 AND isPositive= true;',
    'GET_SPEND_AMOUNT': 'SELECT SUM (amount) as sum FROM TRANSACTION  WHERE userId = $1 AND isPositive=false;',
    'ADD_CATEGORIE': 'INSERT INTO categorie (name, userId) VALUES ($1, $2)',
    'SHOW_CATEGORIES': 'SELECT * FROM categorie WHERE userId = $1;',
    'ACCOUNT_BALANCE_DETAILS': 'SELECT c.id, c.name as categorieName, t.name, t.amount, t.ispositive, t."timeStamp" FROM  categorie c ' +
        'INNER JOIN TRANSACTION t ON c.id= t.categorieId  WHERE t.userId = $1 ORDER BY c.id ASC, t."timeStamp" ASC ;',
    'DELETE_CATEGOIRE': 'DELETE FROM categorie WHERE id=$1'
};
exports.queries = queries;
