
const { databaseConnection, botToken } = require('./config/config');
import { executeQuery } from './helpers/database-adapter';
import { queries } from './helpers/queries';
import { logger } from './helpers/logger';
const Telegraf = require('telegraf');
const session = Telegraf.session;
const Markup = Telegraf.Markup;
const extra = Telegraf.Extra;
const Keyboard = Telegraf.Keyboard;
const WizardScene = require("telegraf/scenes/wizard");
const Stage = require("telegraf/stage");

const bot = new Telegraf(botToken)

bot.start((ctx) => {
    let chatId = ctx.update.message.chat.id;
    let userId = ctx.update.message.from.id;

    addChatAndUserIfNotExist(chatId, userId);

    ctx.reply(
        `Hello ${ctx.from.first_name}, welcome to the finace bot!\nBelow me you  see the available options with which you can interact with me.`,
        Markup.inlineKeyboard(
            [
                Markup.callbackButton("+€", "ADD_TODO"),
                Markup.callbackButton("-€", "SHOW_LIST"),
                Markup.callbackButton("show current account balance ", "DONE")
            ]
        ).extra()
    )
});



bot.catch((err, ctx) => {
    logger.error(`Ooops, ecountered an error for ${ctx.updateType}`, err)
})



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



const newAmount = new WizardScene(
    "new_amount",
   
    ctx => {
        ctx.reply("Please enter the amount, you have spent");
        return ctx.wizard.next();
    },
    async ctx => {
        let userId = ctx.message.from.id;
        let chatId = ctx.message.chat.id;
        try {
            await addChatAndUserIfNotExist(chatId, userId);
            //name,  amount, isPositive, notice, categorieId, userID, chatId
            await executeQuery(queries.INSERT_TRANSACTION, ["testName", parseInt(ctx.message.text), true, "notice", 1, parseInt(userId), parseInt(chatId)]);
        }
        catch (err) {
            logger.error(err);
        }

        ctx.wizard.state.item = ctx.message.text;

        ctx.replyWithHTML(
            `Amount <b>"${
            ctx.wizard.state.item
            }" </b> added`
        );
        return ctx.scene.leave();
    }
);


const stage = new Stage([newAmount]);
bot.use(session());
bot.use(stage.middleware());

bot.command('add', async ({ reply, scene }) => {
    await scene.leave()
    await scene.enter('new_amount')
}
);


bot.launch()

async function addChatAndUserIfNotExist(chatId, userId) {
    await addChatIfNotExist(chatId);
    await addUserIfNotExist(userId);
}

async function addChatIfNotExist(chatId) {
    let response = await executeQuery(queries.CHECK_IF_CHAT_EXIST, [chatId]);
    if (response['rowCount'] == 0) {
        await executeQuery(queries.ADD_CHAT, [chatId]);
    }
}

async function addUserIfNotExist(userId) {
    let response = await executeQuery(queries.CHECK_IF_USER_EXIST, [userId]);
    if (response['rowCount'] == 0) {
        executeQuery(queries.ADD_USER, [userId]);
    }
}