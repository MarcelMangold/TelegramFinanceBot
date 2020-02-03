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
    ctx.reply("Please enter the reason for the income");
    return ctx.wizard.next();
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
    ctx.reply("Please enter the reason for the spending");
    return ctx.wizard.next();
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
bot.command('add_categorie', function (_a) {
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
    var resultIncome, resultSpend, income, spend, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.GET_INCOME_AMOUNT, [ctx.update.message.from.id])];
            case 1:
                resultIncome = _a.sent();
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.GET_SPEND_AMOUNT, [ctx.update.message.from.id])];
            case 2:
                resultSpend = _a.sent();
                income = resultIncome.rows[0].sum == null ? 0 : resultIncome.rows[0].sum;
                spend = resultSpend.rows[0].sum == null ? 0 : resultSpend.rows[0].sum;
                ctx.replyWithHTML("Account balance: \n" +
                    ("Income: <b>" + income + "\u20AC</b> \n") +
                    ("Spend: <b>" + spend + "\u20AC</b> \n") +
                    ("Sum: <b>" + (income - spend) + "\u20AC</b>"));
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                logger_1.logger.error(err_4);
                ctx.replyWithHTML("Error while checking the account balance ");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
bot.command('account_balance_details', function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var queryResult, result, text_1, actualCategorieId_1, sumOfCategorie_1, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.ACCOUNT_BALANCE_DETAILS, [ctx.update.message.from.id])];
            case 1:
                queryResult = _a.sent();
                result = queryResult.rows;
                text_1 = '<b>Account balance details:</b>\n\n';
                actualCategorieId_1 = result[0].id;
                text_1 += "<b>" + result[0].categoriename + "</b>";
                sumOfCategorie_1 = 0;
                //fix order here for sum
                result.forEach(function (element) {
                    var amount = element.amount;
                    if (element.id > actualCategorieId_1) {
                        text_1 += "\n<b>Sum of categorie " + sumOfCategorie_1 + "</b>";
                        sumOfCategorie_1 = 0;
                        text_1 += "\n\n---------------------------------------------";
                        text_1 += "\n\n <b>" + element.categoriename + "</b>";
                        actualCategorieId_1 = element.id;
                    }
                    text_1 += "\n Reason: " + element.name + "  <b>" + amount + "\u20AC</b>";
                    sumOfCategorie_1 += +amount;
                });
                ctx.replyWithHTML(text_1);
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
