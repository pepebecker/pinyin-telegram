const Telegraf = require('telegraf')
const convert = require('pinyin-converter')
const findHanzi = require('find-hanzi')
const split = require('pinyin-split')

const BOT_TOKEN = '368670088:AAE0Uepq5Ik3TaPKEEEDGcHZsKQEb6CW4A4'

const bot = new Telegraf(BOT_TOKEN)

const HANZI  = 1
const PINYIN = 2
const SPLIT  = 3
let status = 0

bot.command('start', (ctx) => {
	ctx.reply('nǐ hǎo')
})

const sendHanzi = (text, ctx) => {
	status = 0
	findHanzi(text).then((data) => {
		let response = ''

		for (let item of data) {
			if (item.hanzi) response += 'Character: ' + item.hanzi + '\n'
			if (item.pinyin) response += 'Pinyin: ' + item.pinyin + '\n'
			if (item.cangjie) response += 'Cangjie: ' + item.cangjie
			if (item.kangjie) response += ' | ' + item.kangjie + '\n'
			if (item.definition) response += 'Definition: ' + item.definition + '\n'
			response += '\n'
		}

		if (response.replace(/\n\ /g, '') != '') {
			ctx.reply(response)
		}
	}).catch((error) => {
		ctx.reply(error)
	})
}

const sendPinyin = (text, ctx) => {
	status = 0
	convert(text, {keepSpaces: true}).then((data) => {
		ctx.reply(data)
	})
}

const sendSplitted = (text, ctx) => {
	status = 0
	split(text).then((data) => {
		ctx.reply(data.join(' '))
	})
}

const onHanzi = (ctx) => {
	let text = ctx.update.message.text
	if (text === '/h' || text === '/hanzi') {
		status = HANZI
	} else {
		text = text.replace('/hanzi ', '')
		text = text.replace('/h ', '')
		sendHanzi(text, ctx)
	}
}

const onPinyin = (ctx) => {
	let text = ctx.update.message.text
	if (text === '/p' || text === '/pinyin') {
		status = PINYIN
	} else {
		text = text.replace('/pinyin ', '')
		text = text.replace('/p ', '')
		sendPinyin(text, ctx)
	}
}

const onSplit = (ctx) => {
	let text = ctx.update.message.text
	if (text === '/s' || text === '/split') {
		status = SPLIT
	} else {
		text = text.replace('/split ', '')
		text = text.replace('/s ', '')
		sendSplitted(text, ctx)
	}
}

bot.command('h', (ctx) => onHanzi(ctx))
bot.command('hanzi', (ctx) => onHanzi(ctx))

bot.command('p', (ctx) => onPinyin(ctx))
bot.command('pinyin', (ctx) => onPinyin(ctx))

bot.command('s', (ctx) => onSplit(ctx))
bot.command('split', (ctx) => onSplit(ctx))

bot.on('text', (ctx) => {
	const text = ctx.update.message.text

	if (/^\/\w+/.test(text)) return

	switch(status) {
	case HANZI:
		sendHanzi(text, ctx)
		break
	case PINYIN:
		sendPinyin(text, ctx)
		break
	case SPLIT:
		sendSplitted(text, ctx)
		break
	default:
		sendPinyin(text, ctx)
		break
	}
})

bot.catch((err) => {
  console.log('Ooops', err)
})

bot.startPolling()
