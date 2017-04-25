const Telegraf = require('telegraf')
const convert = require('pinyin-converter')
const findHanzi = require('find-hanzi')

const BOT_TOKEN = '368670088:AAFMqOm5ekzjpiFgqNnEt1GqbqWlGphhG7E'

const bot = new Telegraf(BOT_TOKEN)

bot.command('start', (ctx) => {
	ctx.reply(`Started`)
})

let expectingCharacter = false

const respondWithCharacters = (text, ctx) => {
	text = text.replace('/h ', '')
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

bot.command('h', (ctx) => {
	let text = ctx.update.message.text
	if (text === '/h') {
		ctx.reply('Please provide some information about the character')
		expectingCharacter = true
	} else {
		respondWithCharacters(text, ctx)
	}
})

bot.on('text', (ctx) => {
	const text = ctx.update.message.text
	if (expectingCharacter) {
		respondWithCharacters(text, ctx)
		expectingCharacter = false
	} else {
		convert(text, {keepSpaces: true}).then((data) => {
			ctx.reply(data)
		})
	}
})

bot.catch((err) => {
  console.log('Ooops', err)
})

bot.startPolling()
