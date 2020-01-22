
const { databaseConnection, botToken } = require('./config/config');
import { executeQuery } from './helpers/database-adapter';
import { queries } from './helpers/queries';
import { logger } from './helpers/logger';
import { QueryResult } from 'pg';
const Telegraf = require('telegraf');
const session = Telegraf.session;
const Markup = Telegraf.Markup;
const Extra = Telegraf.Extra;
const Keyboard = require('telegraf-keyboard');
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

bot.command('showCategories', async (ctx) => {
    let chatId = ctx.update.message.chat.id;
    let userID = ctx.update.message.from.id;

    await addChatAndUserIfNotExist(chatId, userID);
    let result = await executeQuery(queries.SHOW_CATEGORIES, [userID]);
    let htmlText = '<b>Currently there are no categories todos</b>';
    if (result.rows.length > 0) {
        htmlText = '<b>Categories:</b>';
        for (let i = 0; i < result.rows.length; i++) {
            htmlText += `\n ${i + 1}. ${result.rows[i].name}`;
        }
    }
    ctx.replyWithHTML(htmlText);
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





const newCategorie = new WizardScene(
    "new_categorie",
    ctx => {
        ctx.reply("Please type the categorie you want to create");
        return ctx.wizard.next();
    },
    async ctx => {
        let userId = ctx.message.from.id;
        let chatId = ctx.message.chat.id;      
        try {
            await addChatAndUserIfNotExist(chatId, userId);
            //name,  amount, isPositive, notice, categorieId, userID, chatId
            await executeQuery(queries.ADD_CATEGORIE, [ctx.message.text, userId]);
            ctx.replyWithHTML(
                `The category ${ctx.message.text} was created successfully`
            );
        }
        catch (err) {
            logger.error(err);
            ctx.replyWithHTML(
                `<b>Error while saving the categorie in the database</b>`
            );
        }
      
     
        return ctx.scene.leave();
    } 
);



const newAmount = new WizardScene(
    "new_amount",
    ctx => {
        let messageId = ctx.update.callback_query.message.message_id
        let actionData:string = ctx.update.callback_query.data;
        ctx.tg.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id)
        ctx.wizard.state.categorie = [actionData.replace("action", "").split("-")[0]];
        ctx.reply("Please enter the amount you spent");
        return ctx.wizard.next();
    },
    async ctx => {
        let userId = ctx.message.from.id;
        let chatId = ctx.message.chat.id;
        ctx.wizard.state.item = ctx.message.text;
        
        
        try {
            await addChatAndUserIfNotExist(chatId, userId);
            //name,  amount, isPositive, notice, categorieId, userID, chatId
            await executeQuery(queries.INSERT_TRANSACTION, ["test", parseInt(ctx.update.message.text),true, "notice", parseInt(ctx.wizard.state.categorie), userId, chatId]);
            ctx.replyWithHTML(
                `The amount of <b>${
                    parseInt(ctx.update.message.text)
                }€</b> were booked to the account`
            );
        }
        catch (err) {
            logger.error(err);
            ctx.replyWithHTML(
                `<b>Error while saving the money in the database</b>`
            );
        }
      
     
        return ctx.scene.leave();
    } 
);


const stage = new Stage([newAmount,newCategorie]);
bot.use(session());
bot.use(stage.middleware());


bot.command('addCategorie', async ({ reply, scene }) => {
    await scene.leave()
    await scene.enter('new_categorie')
}
);

bot.command('add', async (ctx) => {
    let userId = ctx.message.from.id;
    let chatId = ctx.message.chat.id;
    addChatIfNotExist(chatId);

    let result: QueryResult = await executeQuery(queries.GET_CATEGORIES, [userId]);
    if (result.rowCount > 0) {
        const options = {
            inline: true, // default
            duplicates: false, // default
            newline: false, // default
        };
        const keyboard = new Keyboard(options);
        let row = [];
        let rows = [];
        let columnCount = 0;
        for (let i = 0; i < result.rows.length; i++) {
            ++columnCount;
            let actionName:string = result.rows[i].id + "-" + result.rows[i].name
            let string = result.rows[i].name + ":action" + actionName;

            row.push(string)
            if (columnCount == 2) {
                rows.push(row);
                row = [];
                columnCount = 0;
            }

        };
        rows.push(row);
        rows.forEach(element => {
            keyboard
                .add(element)

        })
        ctx.reply('Select the amounts categorie', keyboard.draw());
    }
    else {
        ctx.replyWithHTML('<b>Currently there are no open todos</b>');
    }
}
);

const regex = new RegExp('action[0-9]');

bot.action(regex, async (ctx) => {
    let actionData = ctx.update.callback_query.data;

    ctx.replyWithHTML(`You have chosen the category <b> ${actionData.replace("action", "").split("-")[1]} </b>`, Extra.markup(Markup.removeKeyboard()));
    ctx.editMessageReplyMarkup({});

    await ctx.scene.leave();
    await ctx.scene.enter('new_amount');

} );

bot.command('accountBalance', async (ctx) => {
 
    try {
        let result: QueryResult = await executeQuery(queries.GET_ACCOUNT_BALANCE, [ctx.update.message.from.id]);
        ctx.replyWithHTML(`Your actual account balance is <b>${result.rows[0].sum}€</b>`);
    } catch (err) {
        logger.error(err);
        ctx.replyWithHTML(`Error while checking the account balance `);
    }
   
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