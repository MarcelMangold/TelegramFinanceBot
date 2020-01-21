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
var _a = require('./config/config'), databaseConnection = _a.databaseConnection, botToken = _a.botToken;
var database_adapter_1 = require("./helpers/database-adapter");
var queries_1 = require("./helpers/queries");
var logger_1 = require("./helpers/logger");
var Telegraf = require('telegraf');
var session = Telegraf.session;
var Markup = Telegraf.Markup;
var extra = Telegraf.Extra;
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
var newAmount = new WizardScene("new_amount", function (ctx) {
    ctx.reply("Please enter the amount, you have spent");
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
                console.log(ctx);
                return [4 /*yield*/, addChatAndUserIfNotExist(chatId, userId)];
            case 2:
                _a.sent();
                //name,  amount, isPositive, notice, categorieId, userID, chatId
                return [4 /*yield*/, database_adapter_1.executeQuery(queries_1.queries.INSERT_TRANSACTION, ["'testName'", parseInt(ctx.message.text), true, "'notice'", 1, parseInt(userId), parseInt(chatId)])];
            case 3:
                //name,  amount, isPositive, notice, categorieId, userID, chatId
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                logger_1.logger.error(err_1);
                return [3 /*break*/, 5];
            case 5:
                ctx.wizard.state.item = ctx.message.text;
                ctx.replyWithHTML("Amount <b>\"" + ctx.wizard.state.item + "\" </b> added");
                return [2 /*return*/, ctx.scene.leave()];
        }
    });
}); });
var stage = new Stage([newAmount]);
bot.use(session());
bot.use(stage.middleware());
bot.command('add', function (_a) {
    var reply = _a.reply, scene = _a.scene;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, scene.leave()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, scene.enter('new_amount')];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
});
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
