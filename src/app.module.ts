import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotModule } from './bot/bot.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SlotMachineModule } from './slot-machine/slot-machine.module';
import { TicketModule } from './ticket/ticket.module';
import { UpgradeModule } from './upgrade/upgrade.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // делает переменные окружения доступными глобально в приложении
      envFilePath: '.env', // указывает путь к файлу .env
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend-build'), // Путь к сборке фронтенда
      exclude: ['/api*'], // Исключаем API маршруты
    }),
    BotModule,
    AuthModule,
    UpgradeModule,
    UserModule,
    SlotMachineModule,
    TicketModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
