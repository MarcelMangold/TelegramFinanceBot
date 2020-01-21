
const {databaseConnection, botToken} = require('./config/config');
const logger = require('./helpers/logger');
const Telegraf = require('telegraf');
const session = Telegraf.session;
const markup = Telegraf.Markup;
const extra = Telegraf.Extra;
const WizardScene = require("telegraf/scenes/wizard");
const Stage = require("telegraf/stage");

 const bot = new Telegraf(botToken)

 bot.start(({ replyWithMarkdown, message }) => {  
     logger.info("test"); 
        replyWithMarkdown(('greetingsGroup'));
    
});

bot.catch((err, ctx) => {
    logger.error(`Ooops, ecountered an error for ${ctx.updateType}`, err)
})

bot.launch()

