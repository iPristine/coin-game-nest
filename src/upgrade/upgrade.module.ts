import { Module, OnModuleInit } from '@nestjs/common';
import { UpgradeService } from './upgrade.service';
import { UpgradeController } from './upgrade.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [UpgradeService],
  controllers: [UpgradeController],
  exports: [UpgradeService],
})
export class UpgradeModule implements OnModuleInit {
  constructor(private upgradeService: UpgradeService) {}

  async onModuleInit() {
    await this.upgradeService.initializeUpgrades();
  }
}
