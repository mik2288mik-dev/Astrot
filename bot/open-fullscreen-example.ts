import { Telegraf, Markup } from 'telegraf'

const bot = new Telegraf(process.env.BOT_TOKEN as string)

bot.start((ctx) => {
	return ctx.reply(
		'Открыть Astrot',
		Markup.inlineKeyboard([
			Markup.button.webApp('🌌 Запустить Astrot', 'https://<your-vercel-app-url>')
		])
	)
})

// меню бота → кнопка WebApp в шторке профиля
bot.telegram.setChatMenuButton({
	menu_button: { type: 'web_app', text: 'Astrot', web_app: { url: 'https://<your-vercel-app-url>' } }
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))