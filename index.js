const Telegraf = require('telegraf')
const pinyinOrHanzi = require('pinyin-or-hanzi')
const convert = require('pinyin-converter')
const findHanzi = require('find-hanzi')
const split = require('pinyin-split')

const BOT_TOKEN = '368670088:AAEam0EwzGWyFXEADMw8mhtW_tAUvZ29XSQ'

const bot = new Telegraf(BOT_TOKEN)

const HANZI  = 1
const PINYIN = 2
const SPLIT  = 3
let status = 0

const logRecvMessage = (text) => {
	console.log('Received message:', text)
}

const logRecvCommand = (text) => {
	console.log('Received command:', text)
}

const logSendMessage = (text) => {
	console.log('Send message:', text)
}

const logStatus = () => {
	let statusText = ''

	switch(status) {
	case HANZI:
		statusText = 'Hanzi'
		break
	case PINYIN:
		statusText = 'Pinyin'
		break
	case SPLIT:
		statusText = 'Split'
		break
	default:
		statusText = 'Normal'
		break
	}

	console.log('Currrent Status:', status, '-', statusText)
}

const send = (ctx, text) => {
	logSendMessage(text)
	ctx.reply(text)
}

bot.command('start', (ctx) => {
	send(ctx, 'nǐ hǎo')
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
			send(ctx, response)
		}
	}).catch((error) => {
		send(ctx, error)
	})
}

const sendPinyin = (text, ctx) => {
	status = 0
	convert(text, {keepSpaces: true}).then((data) => {
		send(ctx, data)
	})
}

const sendSplitted = (text, ctx) => {
	status = 0
	split(text).then((data) => {
		send(ctx, data.join(' '))
	})
}

const onHanzi = (ctx) => {
	logRecvCommand('hanzi')
	let text = ctx.update.message.text
	if (text === '/h' || text === '/hanzi') {
		status = HANZI
	} else {
		text = text.replace('/hanzi ', '')
		text = text.replace('/h ', '')
		sendHanzi(text, ctx)
	}
	logStatus()
}

const onPinyin = (ctx) => {
	logRecvCommand('pinyin')
	let text = ctx.update.message.text
	if (text === '/p' || text === '/pinyin') {
		status = PINYIN
	} else {
		text = text.replace('/pinyin ', '')
		text = text.replace('/p ', '')
		sendPinyin(text, ctx)
	}
	logStatus()
}

const onSplit = (ctx) => {
	logRecvCommand('split')
	let text = ctx.update.message.text
	if (text === '/s' || text === '/split') {
		status = SPLIT
	} else {
		text = text.replace('/split ', '')
		text = text.replace('/s ', '')
		sendSplitted(text, ctx)
	}
	logStatus()
}

bot.command('h', (ctx) => onHanzi(ctx))
bot.command('hanzi', (ctx) => onHanzi(ctx))

bot.command('p', (ctx) => onPinyin(ctx))
bot.command('pinyin', (ctx) => onPinyin(ctx))

bot.command('s', (ctx) => onSplit(ctx))
bot.command('split', (ctx) => onSplit(ctx))

bot.on('text', (ctx) => {
	const text = ctx.update.message.text
	logRecvMessage(text)

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
		pinyinOrHanzi(text).then((type) => {
			if (type > 0) {
				sendPinyin(text, ctx)
			}
		})
		break
	}

	logStatus()
})

bot.catch((err) => {
	logStatus()
	console.log('Ooops', err)
})

bot.startPolling()
