import { Module } from '@nestjs/common';
import { SlotMachineService } from './slot-machine.service';
import { SlotMachineController } from './slot-machine.controller';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpgradeModule } from 'src/upgrade/upgrade.module';

@Module({
  imports: [UpgradeModule],
  controllers: [SlotMachineController],
  providers: [SlotMachineService, UserService, PrismaService],
})
export class SlotMachineModule {}
