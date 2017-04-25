const Telegraf = require('telegraf')
const convert = require('pinyin-converter')
const findHanzi = require('find-hanzi')

const BOT_TOKEN = '368670088:AAE0Uepq5Ik3TaPKEEEDGcHZsKQEb6CW4A4'

const bot = new Telegraf(BOT_TOKEN)

bot.command('start', (ctx) => {
	ctx.reply('nǐ hǎo')
})

const respondWithCharacters = (text, ctx) => {
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

const respondWithPinyin = (text, ctx) => {
	convert(text, {keepSpaces: true}).then((data) => {
		ctx.reply(data)
	})
}

bot.command('h', (ctx) => {
	let text = ctx.update.message.text
	if (text !== '/h') {
		text = text.replace('/h ', '')
		respondWithCharacters(text, ctx)
	}
})

bot.command('p', (ctx) => {
	let text = ctx.update.message.text
	if (text !== '/p') {
		text = text.replace('/p ', '')
		respondWithPinyin(text, ctx)
	}
})

bot.on('text', (ctx) => {
	const text = ctx.update.message.text
	respondWithPinyin(text, ctx)
})

bot.catch((err) => {
  console.log('Ooops', err)
})

bot.startPolling()
