'use strict'

const Telegraf = require('telegraf')
const botCore = require('pinyin-bot-core')

const BOT_TOKEN = '368670088:AAEam0EwzGWyFXEADMw8mhtW_tAUvZ29XSQ'

const bot = new Telegraf(BOT_TOKEN)

botCore.setPlatform('telegram')

bot.command('start', (ctx) => {
	const text = 'nǐ hǎo'
	ctx.reply(text)
	console.log('Sent message:', text)
})

bot.on('text', (ctx) => {
	const text = ctx.update.message.text
	botCore.processMessage(text, ctx)
})

bot.catch((err) => {
	console.error('Ooops', err)
})

bot.startPolling()
