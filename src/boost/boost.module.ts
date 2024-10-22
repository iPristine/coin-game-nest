import { Module, OnModuleInit } from '@nestjs/common';
import { BoostService } from './boost.service';
import { BoostController } from './boost.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [BoostService],
  controllers: [BoostController],
  exports: [BoostService],
})
export class BoostModule implements OnModuleInit {
  constructor(private boostService: BoostService) {}

  async onModuleInit() {
    await this.boostService.initializeBoosts();
  }
}
