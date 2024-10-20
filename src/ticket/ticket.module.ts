import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { UserModule } from '../user/user.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [UserModule, PrismaModule],
  providers: [TicketService],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}
