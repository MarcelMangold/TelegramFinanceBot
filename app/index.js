"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var botToken = require('./config/config').botToken;
var database_adapter_1 = require("./helpers/database-adapter");
var queries_1 = require("./helpers/queries");
var logger_1 = require("./helpers/logger");
var Telegraf = require('telegraf');
var session = Telegraf.session;
var Markup = Telegraf.Markup;
var Extra = Telegraf.Extra;
var Keyboard = require('telegraf-keyboard');
var WizardScene = require("telegraf/scenes/wizard");
var Stage = require("telegraf/stage");
var bot = new Telegraf(botToken);
bot.start(function (ctx) {
    var chatId = ctx.update.message.chat.id;
    var userId = ctx.update.message.from.id;
    addChatAndUserIfNotExist(chatId, userId);
    ctx.reply("Hello " + ctx.from.first_name + ", welcome to the finace bot!\nBelow me you  see the available options with which you can interact with me.", Markup.inlineKeyboard([
        Markup.callbackButton("+€", "ADD_TODO"),
        Markup.callbackButton("-€", "SHOW_LIST"),
        Markup.callbackButton("show current account balance ", "DONE")
    ]).extra());
});
bot["catch"](function (err, ctx) {
    logger_1.logger.error("Ooops, ecountered an error for " + ctx.updateType, err);
});
bot.command('show_categories', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId, userID, result, htmlText, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chatId = ctx.update.message.chat.id;
                userID = ctx.update.message.from.id;
                return [4 /*yield*/, addChatAndUserIfNotExist(chatId, userID)];
            case 1:
                _a.sent();
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.SHOW_CATEGORIES, [userID])];
            case 2:
                result = _a.sent();
                htmlText = '<b>Currently there are no categories todos</b>';
                if (result.rows.length > 0) {
                    htmlText = '<b>Categories:</b>';
                    for (i = 0; i < result.rows.length; i++) {
                        htmlText += "\n " + (i + 1) + ". " + result.rows[i].name;
                    }
                }
                ctx.replyWithHTML(htmlText);
                return [2 /*return*/];
        }
    });
}); });
/* bot.command('newAmount', async (ctx) => {

    let chatId = ctx.update.message.chat.id;
    await addChatIfNotExist(chatId);
    let result = await executeQuery(queries.SHOW_TODOS, [chatId, false]);
    let htmlText = '<b>Currently there are no open todos</b>';
    if (result.rows.length > 0) {
        htmlText = '<b>Open todos:</b>';
        for (let i = 0; i < result.rows.length; i++) {
            htmlText += `\n ${i + 1} - ${result.rows[i].name}`;
        }
    }
    ctx.replyWithHTML(htmlText);
}) */
var deleteCategorie = new WizardScene("delete_categorie", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var actionData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                actionData = ctx.update.callback_query.data;
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.DELETE_CATEGOIRE, [actionData.replace("action", "").split("-")[0]])];
            case 1:
                _a.sent();
                ctx.replyWithHTML("The categorie <b>" + actionData.replace("delete_categorie", "").split("-")[1] + "</b> is deleted");
                return [2 /*return*/, ctx.scene.leave()];
        }
    });
}); });
var newCategorie = new WizardScene("new_categorie", function (ctx) {
    ctx.reply("Please type the categorie you want to create");
    return ctx.wizard.next();
}, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, chatId, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = ctx.message.from.id;
                chatId = ctx.message.chat.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, addChatAndUserIfNotExist(chatId, userId)];
            case 2:
                _a.sent();
                //name,  amount, isPositive, notice, categorieId, userID, chatId
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.ADD_CATEGORIE, [ctx.message.text, userId])];
            case 3:
                //name,  amount, isPositive, notice, categorieId, userID, chatId
                _a.sent();
                ctx.replyWithHTML("The category " + ctx.message.text + " was created successfully");
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                logger_1.logger.error(err_1);
                ctx.replyWithHTML("<b>Error while saving the categorie in the database</b>");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, ctx.scene.leave()];
        }
    });
}); });
var newIncome = new WizardScene("new_income", function (ctx) {
    var actionData = ctx.update.callback_query.data;
    console.log(ctx.update.callback_query.message.message_id);
    try {
        ctx.tg.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id);
    }
    catch (err) {
        logger_1.logger.error("error while deleting message");
    }
    ctx.wizard.state.categorie = [actionData.replace("action", "").split("-")[0]];
    ctx.reply("Please enter the income you got");
    return ctx.wizard.next();
}, function (ctx) {
    ctx.wizard.state.amount = ctx.message.text;
    if (!isNaN(parseFloat(ctx.wizard.state.amount.replace(',', '.')))) {
        ctx.reply("Please enter the reason for the income");
        return ctx.wizard.next();
    }
    else {
        ctx.replyWithHTML("The input is not allowed. The transaction was cancelled.");
        return ctx.scene.leave();
    }
}, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, chatId, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = ctx.message.from.id;
                chatId = ctx.message.chat.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, addChatAndUserIfNotExist(chatId, userId)];
            case 2:
                _a.sent();
                //name,  amount, isPositive, notice, categorieId, userID, chatId
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.INSERT_TRANSACTION, [ctx.message.text, parseFloat(ctx.wizard.state.amount.replace(',', '.')), true, "notice", parseInt(ctx.wizard.state.categorie), userId, chatId])];
            case 3:
                //name,  amount, isPositive, notice, categorieId, userID, chatId
                _a.sent();
                ctx.replyWithHTML("The income of <b>" + ctx.wizard.state.amount + "\u20AC</b> were booked to the account");
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                logger_1.logger.error(err_2);
                ctx.replyWithHTML("<b>Error while saving the money in the database</b>");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, ctx.scene.leave()];
        }
    });
}); });
var newAmount = new WizardScene("new_amount", function (ctx) {
    var actionData = ctx.update.callback_query.data;
    console.log(ctx.update.callback_query.message.message_id);
    try {
        ctx.tg.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id);
    }
    catch (err) {
        logger_1.logger.error("error while deleting message");
    }
    ctx.wizard.state.categorie = [actionData.replace("action", "").split("-")[0]];
    ctx.reply("Please enter the amount you spent");
    return ctx.wizard.next();
}, function (ctx) {
    ctx.wizard.state.amount = ctx.message.text;
    if (!isNaN(parseFloat(ctx.wizard.state.amount.replace(',', '.')))) {
        ctx.reply("Please enter the reason for the income");
        return ctx.wizard.next();
    }
    else {
        ctx.replyWithHTML("The input is not allowed. The transaction was cancelled.");
        return ctx.scene.leave();
    }
}, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, chatId, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = ctx.message.from.id;
                chatId = ctx.message.chat.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, addChatAndUserIfNotExist(chatId, userId)];
            case 2:
                _a.sent();
                //name,  amount, isPositive, notice, categorieId, userID, chatId
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.INSERT_TRANSACTION, [ctx.message.text, parseFloat(ctx.wizard.state.amount.replace(',', '.')), false, "notice", parseInt(ctx.wizard.state.categorie), userId, chatId])];
            case 3:
                //name,  amount, isPositive, notice, categorieId, userID, chatId
                _a.sent();
                ctx.replyWithHTML("The amount of <b>" + ctx.wizard.state.amount + "\u20AC</b> were booked to the account");
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                logger_1.logger.error(err_3);
                ctx.replyWithHTML("<b>Error while saving the money in the database</b>");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, ctx.scene.leave()];
        }
    });
}); });
var stage = new Stage([newAmount, newCategorie, newIncome, deleteCategorie]);
bot.use(session());
bot.use(stage.middleware());
bot.command('new_categorie', function (_a) {
    var reply = _a.reply, scene = _a.scene;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, scene.leave()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, scene.enter('new_categorie')];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
});
function getCategoriesInKeyboard(userId, kindOfKeyboard) {
    return __awaiter(this, void 0, void 0, function () {
        var result, options, keyboard_1, row, rows, columnCount, i, actionName, string;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.GET_CATEGORIES, [userId])];
                case 1:
                    result = _a.sent();
                    if (result.rowCount > 0) {
                        options = {
                            inline: true,
                            duplicates: false,
                            newline: false
                        };
                        keyboard_1 = new Keyboard(options);
                        row = [];
                        rows = [];
                        columnCount = 0;
                        for (i = 0; i < result.rows.length; i++) {
                            ++columnCount;
                            actionName = result.rows[i].id + "-" + result.rows[i].name + "-" + kindOfKeyboard;
                            string = result.rows[i].name + ":action" + actionName;
                            row.push(string);
                            if (columnCount == 2) {
                                rows.push(row);
                                row = [];
                                columnCount = 0;
                            }
                        }
                        ;
                        rows.push(row);
                        rows.forEach(function (element) {
                            keyboard_1
                                .add(element);
                        });
                        return [2 /*return*/, keyboard_1];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
bot.command('delete_categorie', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userID, chatId, keyboard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userID = ctx.message.from.id;
                chatId = ctx.message.chat.id;
                addChatAndUserIfNotExist(chatId, userID);
                return [4 /*yield*/, getCategoriesInKeyboard(userID, "delete_categorie")];
            case 1:
                keyboard = _a.sent();
                ctx.reply('Select the categorie which you want to delete', keyboard.draw());
                return [2 /*return*/];
        }
    });
}); });
bot.command('new_amount', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, chatId, keyboard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = ctx.message.from.id;
                chatId = ctx.message.chat.id;
                addChatIfNotExist(chatId);
                return [4 /*yield*/, getCategoriesInKeyboard(userId, "new_amount")];
            case 1:
                keyboard = _a.sent();
                ctx.reply('Select the amounts categorie', keyboard.draw());
                return [2 /*return*/];
        }
    });
}); });
bot.command('new_income', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, chatId, keyboard;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = ctx.message.from.id;
                chatId = ctx.message.chat.id;
                addChatIfNotExist(chatId);
                return [4 /*yield*/, getCategoriesInKeyboard(userId, "new_income")];
            case 1:
                keyboard = _a.sent();
                ctx.reply('Select the incomes categorie', keyboard.draw());
                return [2 /*return*/];
        }
    });
}); });
var regex = new RegExp('action[0-9]');
bot.action(regex, function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var actionData;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                actionData = ctx.update.callback_query.data;
                ctx.replyWithHTML("You have chosen the category <b> " + actionData.replace("action", "").split("-")[1] + " </b>", Extra.markup(Markup.removeKeyboard()));
                ctx.editMessageReplyMarkup({});
                return [4 /*yield*/, ctx.scene.leave()];
            case 1:
                _a.sent();
                return [4 /*yield*/, ctx.scene.enter([actionData.replace("action", "").split("-")[2]].toString())];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
bot.command('account_balance', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.TOAL_SUM, [ctx.update.message.from.id])];
            case 1:
                result = _a.sent();
                if (result.rowCount > 0)
                    ctx.replyWithHTML("<b>Account balance:</b>\n" + createAccountBalanceText(result.rows[0]));
                else
                    ctx.replyWithHTML("There are no entries to show");
                return [3 /*break*/, 3];
            case 2:
                err_4 = _a.sent();
                logger_1.logger.error(err_4);
                ctx.replyWithHTML("Error while checking the account balance ");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.command('account_balance_details', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var queryResult, text, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.ACCOUNT_BALANCE_DETAILS, [ctx.update.message.from.id])];
            case 1:
                queryResult = _a.sent();
                if (queryResult.rowCount > 0) {
                    text = '<b>Account balance details:</b>\n\n';
                    ctx.replyWithHTML(createBalanceDetailsText(queryResult.rows, text));
                }
                else {
                    ctx.replyWithHTML('There are no entries. Please use the function "new_amount" or "new_income"');
                }
                return [3 /*break*/, 3];
            case 2:
                err_5 = _a.sent();
                logger_1.logger.error(err_5);
                ctx.replyWithHTML("Error while checking the account balance details");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.command('curr_monthly_acc_balance_details', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var queryResult, text, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.CURRENT_MONTHLY_ACCOUNT_BALANCE_DETAILS, [ctx.update.message.from.id])];
            case 1:
                queryResult = _a.sent();
                if (queryResult.rowCount > 0) {
                    text = '<b>Current account balance details:</b>\n\n';
                    ctx.replyWithHTML(createBalanceDetailsText(queryResult.rows, text));
                }
                else {
                    ctx.replyWithHTML('There are no entries. Please use the function "new_amount" or "new_income"');
                }
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                logger_1.logger.error(err_6);
                ctx.replyWithHTML("Error while checking the account balance details");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.command('monthly_account_balance_details', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var queryResult, text, result, actualMonth, actualStartMonthIndex, options, index, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.MONTHLY_ACCOUNT_BALANCE_DETAILS, [ctx.update.message.from.id])];
            case 1:
                queryResult = _a.sent();
                if (queryResult.rowCount > 0) {
                    text = '<b> Montly account balance details </b>';
                    result = queryResult.rows;
                    actualMonth = result[0].timeStamp.getMonth();
                    actualStartMonthIndex = 0;
                    options = { month: 'long' };
                    for (index in result) {
                        if (parseInt(index) == result.length - 1) {
                            text += "\n\n<b>++++ Costs in " + result[index].timeStamp.toLocaleDateString('en', options) + " ++++</b>\n";
                            text = createBalanceDetailsText(result.slice(actualStartMonthIndex, parseInt(index + 1)), text);
                        }
                        else if (result[index].timeStamp.getMonth() > actualMonth) {
                            text += "\n\n<b>++++ Costs in " + result[parseInt(index) - 1].timeStamp.toLocaleDateString('en', options) + " ++++</b>\n";
                            text = createBalanceDetailsText(result.slice(actualStartMonthIndex, parseInt(index) - 1), text);
                            actualStartMonthIndex = parseInt(index);
                            actualMonth = result[index].timeStamp.getMonth();
                        }
                    }
                    ctx.replyWithHTML(text);
                }
                else {
                    ctx.replyWithHTML('There are no entries. Please use the function "new_amount" or "new_income"');
                }
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                logger_1.logger.error(err_7);
                ctx.replyWithHTML("Error while checking the account balance details");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.command('monthly_account_balance', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var result, text, index, date, month, totalSum_1, err_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.MONTHLY_SUM, [ctx.update.message.from.id])];
            case 1:
                result = _a.sent();
                text = "<b>Monthly account balance</b>\n";
                for (index in result.rows) {
                    date = new Date();
                    date.setMonth(result.rows[index]['month'] - 1);
                    month = date.toLocaleDateString('default', { month: 'long' });
                    text += "\n++++ <b>" + month + "</b> ++++\n";
                    text += createAccountBalanceText(result.rows[index]);
                }
                totalSum_1 = 0;
                result.rows.forEach(function (element) {
                    if (!element.ispositive)
                        totalSum_1 += +element.sum;
                    else
                        totalSum_1 -= +element.sum;
                });
                text += "\n------------------------\n<b>Total sum: " + totalSum_1 + "</b>";
                ctx.replyWithHTML(text);
                return [3 /*break*/, 3];
            case 2:
                err_8 = _a.sent();
                console.log(err_8);
                logger_1.logger.error(err_8);
                ctx.replyWithHTML("Error while checking the account balance details");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.command('daily_account_balance_details', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var queryResult, result, options, text, err_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.DAILY_ACCOUNT_BALANCE_DETAILS, [ctx.update.message.from.id])];
            case 1:
                queryResult = _a.sent();
                if (queryResult.rowCount > 0) {
                    result = queryResult.rows;
                    options = { weekday: 'short', year: '2-digit', month: '2-digit', day: '2-digit' };
                    text = "<b> Daily account balance details (" + queryResult.rows[0].timeStamp.toLocaleDateString('en', options) + ")</b>\n\n";
                    ctx.replyWithHTML(createBalanceDetailsText(result, text));
                }
                else {
                    ctx.replyWithHTML('There are no entries from today. Please use the function "new_amount" or "new_income"');
                }
                return [3 /*break*/, 3];
            case 2:
                err_9 = _a.sent();
                logger_1.logger.error(err_9);
                ctx.replyWithHTML("Error while checking the account balance details");
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
function createAccountBalanceText(accountBalance) {
    return "Income: " + accountBalance.income + "\u20AC \n" +
        ("Spend: " + accountBalance.spend + "\u20AC \n") +
        ("Sum: <b>" + accountBalance.sum + "\u20AC</b>");
}
function createBalanceDetailsText(result, text) {
    var actualCategorieId = result[0].id;
    text += "<b>" + result[0].categoriename + "</b>";
    var sumOfCategorie = 0;
    var totalSum = 0;
    result.forEach(function (element) {
        var amount = element.ispositive == true ? parseFloat("-" + element.amount) : element.amount;
        if (element.id > actualCategorieId) {
            text += "\n<b>Sum of categorie " + sumOfCategorie.toFixed(2) + "\u20AC</b>";
            totalSum += +sumOfCategorie;
            sumOfCategorie = 0;
            text += "\n---------------------------------------------";
            text += "\n <b>" + element.categoriename + "</b>";
            actualCategorieId = element.id;
        }
        var options = { weekday: 'short', year: '2-digit', month: '2-digit', day: '2-digit' };
        text += "\n Reason: " + element.name + "  <b>" + amount + "\u20AC</b>  (" + element.timeStamp.toLocaleDateString('de-DE', options) + ")";
        sumOfCategorie += +amount;
        if (result[result.length - 1] === element) {
            text += "\n<b>Sum of categorie " + sumOfCategorie + "\u20AC</b>";
            totalSum += +sumOfCategorie;
            text += "\n---------------------------------------------\n";
            text += "---------------------------------------------\n";
            text += "<b> Total sum: " + totalSum.toFixed(2) + "\u20AC</b>";
        }
    });
    return text;
}
bot.launch();
function addChatAndUserIfNotExist(chatId, userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, addChatIfNotExist(chatId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, addUserIfNotExist(userId)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function addChatIfNotExist(chatId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.CHECK_IF_CHAT_EXIST, [chatId])];
                case 1:
                    response = _a.sent();
                    if (!(response['rowCount'] == 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.ADD_CHAT, [chatId])];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function addUserIfNotExist(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.CHECK_IF_USER_EXIST, [userId])];
                case 1:
                    response = _a.sent();
                    if (response['rowCount'] == 0) {
                        database_adapter_1.executeQuery(queries_1.queries.ADD_USER, [userId]);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
