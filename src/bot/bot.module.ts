import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { UserService } from "../user/user.service";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [
    PrismaService,
    BotService,
    UserService,
  ]
})
export class BotModule {}
