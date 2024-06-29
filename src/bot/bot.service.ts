import { Injectable } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { Context, Markup, Telegraf } from "telegraf";



@Injectable()
export class BotService {
  private readonly bot: Telegraf;

  constructor(private configService: ConfigService) {
    const botToken = this.configService.get<string>('TG_BOT_TOKEN');
    this.bot = new Telegraf(botToken);

    this.setupCommands();
  }

  onModuleInit() {
    this.bot.launch();
    console.log('Bot started');
  }

  private setupCommands() {
    this.bot.start(this.startCommand);
    this.bot.help(this.helpCommand);
  }

  private startCommand(ctx: Context) {
    return ctx.reply(
      'Привет! 👋 Добро пожаловать в нашего бота. Здесь ты можешь получать токеныб зарабатывать монеты и многое другое! Нажми на кнопку меню, чтобы узнать, что я могу. Если тебе нужна помощь, напиши /help.\n',
      Markup.inlineKeyboard([
        Markup.button.webApp('Play', 'https://coingame.onrender.com')
      ])
    );
  }

  private helpCommand(ctx: Context) {
    const user = ctx.from

    ctx.reply('Вот что я могу делать для тебя:\n' +
      '👉 /start - Перезапустить и увидеть приветственное сообщение\n' +
      '👉 /play - Начать игру или активность\n' +
      '👉 /settings - Настроить свои предпочтения\n' +
      '👉 /info - Получить информацию о сервисе\n' +
      'Если тебе нужна дополнительная помощь или у тебя есть вопросы, не стесняйся спрашивать!');
  }


  // private initializeMessageHandling(): void {
  //   // Обработчик команды /start
  //   this.bot.onText(/\/start/, (msg) => {
  //     const chatId = msg.chat.id;
  //
  //     const user = msg.from; // объект пользователя
  //
  //     if (user) {
  //       const userId = user.id; // ID пользователя
  //       const firstName = user.first_name; // Имя пользователя
  //       const lastName = user.last_name; // Фамилия пользователя
  //       const username = user.username; // Имя пользователя в Telegram
  //
  //       console.log(userId, firstName, lastName, username)
  //       // Теперь вы можете использовать эти данные в вашем приложении
  //     }
  //
  //     const resp = "Привет Оля"
  //
  //     // отправляем ответ
  //     this.bot.sendMessage(chatId, resp);
  //   })
  //
  //   // Обработчик команды /token
  //   this.bot.onText(/\/token/, (msg) => {
  //     console.log('/token')
  //   })
  //
  //   // Обработчик всех сообщений
  //   this.bot.on('message', (msg) => {
  //
  //     const chatId = msg.chat.id;
  //
  //     const user = msg.from; // объект пользователя
  //
  //     if (user) {
  //       const userId = user.id; // ID пользователя
  //       const firstName = user.first_name; // Имя пользователя
  //       const lastName = user.last_name; // Фамилия пользователя
  //       const username = user.username; // Имя пользователя в Telegram
  //
  //       console.log(userId, firstName, lastName, username)
  //       // Теперь вы можете использовать эти данные в вашем приложении
  //     }
  //
  //     const resp = "Привет Оля"
  //
  //     // отправляем ответ
  //     this.bot.sendMessage(chatId, resp);
  //   });
  //
  //
  // }
}