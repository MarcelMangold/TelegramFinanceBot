
const { botToken } = require('./config/config');
import { executeQuery } from './helpers/database-adapter';
import { queries } from './helpers/queries';
import { logger } from './helpers/logger';
import { QueryResult } from 'pg';
import { AccountBalanceDetails } from './@types/queries';

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

bot.command('show_categories', async (ctx) => {
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


const deleteCategorie = new WizardScene(
    "delete_categorie",
    async ctx => {
        let actionData: string = ctx.update.callback_query.data;
        await executeQuery(queries.DELETE_CATEGOIRE, [actionData.replace("action", "").split("-")[0]]);
        ctx.replyWithHTML(`The categorie <b>${actionData.replace("delete_categorie", "").split("-")[1]}</b> is deleted`);
        return ctx.scene.leave();
    }

);


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

const newIncome = new WizardScene(
    "new_income",
    ctx => {
        let actionData: string = ctx.update.callback_query.data;
        console.log(ctx.update.callback_query.message.message_id);
        try { ctx.tg.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id) }
        catch (err) { logger.error("error while deleting message") }
        ctx.wizard.state.categorie = [actionData.replace("action", "").split("-")[0]];
        ctx.reply("Please enter the income you got");
        return ctx.wizard.next();
    },
    ctx => {
        ctx.wizard.state.amount = ctx.message.text;
        ctx.reply("Please enter the reason for the income");
        return ctx.wizard.next();
    },
    async ctx => {
        let userId = ctx.message.from.id;
        let chatId = ctx.message.chat.id;
        try {
            await addChatAndUserIfNotExist(chatId, userId);
            //name,  amount, isPositive, notice, categorieId, userID, chatId
            await executeQuery(queries.INSERT_TRANSACTION, [ctx.message.text, parseFloat(ctx.wizard.state.amount.replace(',', '.')), true, "notice", parseInt(ctx.wizard.state.categorie), userId, chatId]);
            ctx.replyWithHTML(
                `The income of <b>${
                ctx.wizard.state.amount
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

const newAmount = new WizardScene(
    "new_amount",
    ctx => {
        let actionData: string = ctx.update.callback_query.data;
        console.log(ctx.update.callback_query.message.message_id);
        try { ctx.tg.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id) }
        catch (err) { logger.error("error while deleting message") }

        ctx.wizard.state.categorie = [actionData.replace("action", "").split("-")[0]];
        ctx.reply("Please enter the amount you spent");
        return ctx.wizard.next();
    },
    ctx => {
        ctx.wizard.state.amount = ctx.message.text;
        ctx.reply("Please enter the reason for the spending");
        return ctx.wizard.next();
    },
    async ctx => {
        let userId = ctx.message.from.id;
        let chatId = ctx.message.chat.id;
        try {
            await addChatAndUserIfNotExist(chatId, userId);
            //name,  amount, isPositive, notice, categorieId, userID, chatId
            await executeQuery(queries.INSERT_TRANSACTION, [ctx.message.text, parseFloat(ctx.wizard.state.amount.replace(',', '.')), false, "notice", parseInt(ctx.wizard.state.categorie), userId, chatId]);
            ctx.replyWithHTML(
                `The amount of <b>${
                ctx.wizard.state.amount
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


const stage = new Stage([newAmount, newCategorie, newIncome, deleteCategorie]);
bot.use(session());
bot.use(stage.middleware());


bot.command('new_categorie', async ({ reply, scene }) => {
    await scene.leave()
    await scene.enter('new_categorie')
}
);

async function getCategoriesInKeyboard(userId: number, kindOfKeyboard: string) {
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
            let actionName: string = result.rows[i].id + "-" + result.rows[i].name + "-" + kindOfKeyboard;
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
        return keyboard;
    }
}

bot.command('delete_categorie', async (ctx) => {
    let userID = ctx.message.from.id;
    let chatId = ctx.message.chat.id;
    addChatAndUserIfNotExist(chatId, userID);
    let keyboard = await getCategoriesInKeyboard(userID, "delete_categorie");
    ctx.reply('Select the categorie which you want to delete', keyboard.draw());
})

bot.command('new_amount', async (ctx) => {
    let userId = ctx.message.from.id;
    let chatId = ctx.message.chat.id;
    addChatIfNotExist(chatId);
    let keyboard = await getCategoriesInKeyboard(userId, "new_amount");
    ctx.reply('Select the amounts categorie', keyboard.draw());
}
);

bot.command('new_income', async (ctx) => {
    let userId = ctx.message.from.id;
    let chatId = ctx.message.chat.id;
    addChatIfNotExist(chatId);
    let keyboard = await getCategoriesInKeyboard(userId, "new_income");
    ctx.reply('Select the incomes categorie', keyboard.draw());
}
);

const regex = new RegExp('action[0-9]');

bot.action(regex, async (ctx) => {
    let actionData = ctx.update.callback_query.data;

    ctx.replyWithHTML(`You have chosen the category <b> ${actionData.replace("action", "").split("-")[1]} </b>`, Extra.markup(Markup.removeKeyboard()));
    ctx.editMessageReplyMarkup({});

    await ctx.scene.leave();
    await ctx.scene.enter([actionData.replace("action", "").split("-")[2]].toString());

});

bot.command('account_balance', async (ctx) => {

    try {
        let resultIncome: QueryResult = await executeQuery(queries.GET_INCOME_AMOUNT, [ctx.update.message.from.id]);
        let resultSpend: QueryResult = await executeQuery(queries.GET_SPEND_AMOUNT, [ctx.update.message.from.id]);
        let income: number = resultIncome.rows[0].sum == null ? 0 : resultIncome.rows[0].sum;
        let spend: number = resultSpend.rows[0].sum == null ? 0 : resultSpend.rows[0].sum;

        ctx.replyWithHTML(`Account balance: \n` +
            `Income: <b>${income}€</b> \n` +
            `Spend: <b>${spend}€</b> \n` +
            `Sum: <b>${income - spend}€</b>`);
    } catch (err) {
        logger.error(err);
        ctx.replyWithHTML(`Error while checking the account balance `);
    }

}
);

bot.command('account_balance_details', async (ctx) => {

    try {
        let queryResult: QueryResult = await executeQuery(queries.ACCOUNT_BALANCE_DETAILS, [ctx.update.message.from.id]);
        if (queryResult.rowCount > 0) {
            let text: string = '<b>Account balance details:</b>\n\n';
            ctx.replyWithHTML(createBalanceDetailsText(queryResult.rows, text));
        }
        else {
            ctx.replyWithHTML('There are no entries. Please use the function "new_amount" or "new_income"')
        }
    } catch (err) {
        logger.error(err);
        ctx.replyWithHTML(`Error while checking the account balance details`);
    }

}
);

bot.command('current_monthly_account_balance_details', async (ctx) => {

    try {
        let queryResult: QueryResult = await executeQuery(queries.CURRENT_MONTHLY_ACCOUNT_BALANCE_DETAILS, [ctx.update.message.from.id]);
        if (queryResult.rowCount > 0) {
            let text: string = '<b>Current account balance details:</b>\n\n';
            ctx.replyWithHTML(createBalanceDetailsText(queryResult.rows, text));
        }
        else {
            ctx.replyWithHTML('There are no entries. Please use the function "new_amount" or "new_income"')
        }
    } catch (err) {
        logger.error(err);
        ctx.replyWithHTML(`Error while checking the account balance details`);
    }
});

bot.command('monthly_account_balance_details', async (ctx) => {

    try {
        let queryResult: QueryResult = await executeQuery(queries.MONTHLY_ACCOUNT_BALANCE_DETAILS, [ctx.update.message.from.id]);
        if (queryResult.rowCount > 0) {
            let text: string = '<b> Montly account balance details </b>\n\n';
            let result: AccountBalanceDetails[] = queryResult.rows;
            let actualMonth:number = result[0].timeStamp.getMonth();
            let actualStartMonthIndex:number = 0;
            for (const index in result) {
                if(parseInt(index) == result.length-1)
                {
                    text += createBalanceDetailsText(result.slice(actualStartMonthIndex, parseInt(index)), text);
                    console.log(result.slice(actualStartMonthIndex, parseInt(index)));
                }
                else if(result[index].timeStamp.getMonth() > actualMonth)
                {
                   
                    text += createBalanceDetailsText(result.slice(actualStartMonthIndex, parseInt(index)-1), text);
                    console.log(result.slice(actualStartMonthIndex, parseInt(index)-1), text);
                    actualStartMonthIndex = parseInt(index);
                    actualMonth = result[index].timeStamp.getMonth();
                    text += "++++++++++++++++++++++";
                }
            }

            ctx.replyWithHTML(text);
        }
        else {
            ctx.replyWithHTML('There are no entries. Please use the function "new_amount" or "new_income"')
        }
    } catch (err) {
        logger.error(err);
        ctx.replyWithHTML(`Error while checking the account balance details`);
    }
});

function createBalanceDetailsText(result: AccountBalanceDetails[], text: string): string {
    let actualCategorieId: number = result[0].id;
    text += `<b>${result[0].categoriename}</b>`
    let sumOfCategorie: number = 0;
    //fix order here for sum
    result.forEach((element: AccountBalanceDetails) => {
        let amount: number = element.amount;
        if (element.id > actualCategorieId) {
            text += `\n<b>Sum of categorie ${sumOfCategorie}€</b>`;
            sumOfCategorie = 0;
            text += "\n\n---------------------------------------------";
            text += `\n\n <b>${element.categoriename}</b>`;
            actualCategorieId = element.id;
        }
        let options = { weekday: 'short', year: '2-digit', month: '2-digit', day: '2-digit' };
        text += `\n Reason: ${element.name}  <b>${amount}€</b>  (${element.timeStamp.toLocaleDateString('de-DE', options)})`
        sumOfCategorie += +amount;
    })
    return text;
}

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
