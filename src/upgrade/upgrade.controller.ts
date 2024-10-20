import { Controller, Post, Get, UseGuards, Req, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpgradeService } from './upgrade.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('upgrade')
@ApiBearerAuth()
@Controller('upgrade')
export class UpgradeController {
  constructor(private readonly upgradeService: UpgradeService) {}

  @Post('buy/:upgradeName')
  @UseGuards(JwtAuthGuard)
  async buyUpgrade(@Req() req, @Param('upgradeName') upgradeName: string) {
    const userId = req.user.id;
    const newLevel = await this.upgradeService.buyUpgrade(userId, upgradeName);
    return { newLevel };
  }

  @Get('effect/:upgradeName')
  @UseGuards(JwtAuthGuard)
  async getUpgradeEffect(
    @Req() req,
    @Param('upgradeName') upgradeName: string,
  ) {
    const userId = req.user.id;
    return this.upgradeService.getUpgradeEffect(userId, upgradeName);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllUpgrades(@Req() req) {
    const userId = req.user.id;
    return this.upgradeService.getAllUpgrades(userId);
  }
}
