require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Привет! Я бот для записи в парикмахерскую 💈\nНажми ✂️ Записаться", {
    reply_markup: {
      keyboard: [['✂️ Записаться']],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

// Кнопка "Записаться"
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  if (msg.text === '✂️ Записаться') {
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Мужская стрижка', callback_data: 'male' },
            { text: 'Женская стрижка', callback_data: 'female' },
            { text: 'Борода', callback_data: 'beard' }
          ]
        ]
      }
    };
    bot.sendMessage(chatId, 'Выберите услугу:', opts);
  }
});

// Выбор услуги и даты
bot.on('callback_query', (callbackQuery) => {
  const messageId = callbackQuery.message.message_id;
  const chatId = callbackQuery.message.chat.id;

  if (['male', 'female', 'beard'].includes(callbackQuery.data)) {
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Сегодня', callback_data: 'today' },
            { text: 'Завтра', callback_data: 'tomorrow' }
          ]
        ]
      }
    };
    bot.editMessageText('Выберите дату:', { chat_id: chatId, message_id: messageId, reply_markup: opts.reply_markup });
  } else if (['today', 'tomorrow'].includes(callbackQuery.data)) {
    bot.editMessageText('✅ Вы записаны!\nАдминистратор свяжется с вами 💈', { chat_id: chatId, message_id: messageId });
  }
});
