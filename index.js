'use strict'

const Telegraf = require('telegraf')
const botCore = require('pinyin-bot-core')

const BOT_TOKEN = 'SECRET'

const bot = new Telegraf(BOT_TOKEN)

bot.command('start', (ctx) => {
	const text = 'nǐ hǎo'
	ctx.reply(text)
	console.log('Sent message:', text)
})

bot.on('text', (ctx) => {
	const text = ctx.update.message.text
	botCore.processMessage(text, ctx.reply)
	console.log('Sent message:', text)
})

bot.catch((err) => {
	console.error('Ooops', err)
})

bot.startPolling()
