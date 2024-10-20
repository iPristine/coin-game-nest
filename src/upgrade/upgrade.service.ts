import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { UPGRADES } from './upgrade.config';

@Injectable()
export class UpgradeService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async initializeUpgrades() {
    for (const upgrade of UPGRADES) {
      await this.prisma.upgrade.upsert({
        where: { name: upgrade.name },
        update: {
          ...upgrade,
          effect: upgrade.effect as any, // Prisma автоматически сериализует объект в JSON
        },
        create: {
          ...upgrade,
          effect: upgrade.effect as any,
        },
      });
    }
  }

  async buyUpgrade(userId: string, upgradeName: string): Promise<number> {
    const user = await this.userService.findUserById(userId);
    const upgrade = await this.prisma.upgrade.findUnique({
      where: { name: upgradeName },
    });

    if (!upgrade) {
      throw new HttpException('Upgrade not found', HttpStatus.NOT_FOUND);
    }

    const userUpgrade = await this.prisma.userUpgrade.findUnique({
      where: { userId_upgradeId: { userId, upgradeId: upgrade.id } },
    });

    const currentLevel = userUpgrade?.level || 0;
    const cost = Math.floor(
      upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel),
    );

    if (user.coins < cost) {
      throw new HttpException(
        'Not enough coins to buy upgrade',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updatedUserUpgrade = await this.prisma.userUpgrade.upsert({
      where: { userId_upgradeId: { userId, upgradeId: upgrade.id } },
      update: { level: { increment: 1 } },
      create: { userId, upgradeId: upgrade.id, level: 1 },
    });

    await this.userService.updateUser({
      where: { id: userId },
      data: { coins: { decrement: cost } },
    });

    return updatedUserUpgrade.level;
  }

  async getUpgradeEffect(userId: string, upgradeName: string): Promise<any> {
    const upgrade = await this.prisma.upgrade.findUnique({
      where: { name: upgradeName },
    });
    if (!upgrade) {
      throw new HttpException('Upgrade not found', HttpStatus.NOT_FOUND);
    }

    const userUpgrade = await this.prisma.userUpgrade.findUnique({
      where: { userId_upgradeId: { userId, upgradeId: upgrade.id } },
    });

    const level = userUpgrade?.level || 0;
    const effect = upgrade.effect as any;

    switch (effect.type) {
      case 'multiplier':
        return {
          type: 'multiplier',
          value: effect.baseValue + level * effect.incrementPerLevel,
        };
      case 'addition':
        return {
          type: 'addition',
          value: effect.baseValue + level * effect.incrementPerLevel,
        };
      // Добавьте другие типы эффектов по необходимости
      default:
        throw new HttpException(
          'Unknown upgrade effect type',
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  async getAllUpgrades(userId: string) {
    const upgrades = await this.prisma.upgrade.findMany();
    const userUpgrades = await this.prisma.userUpgrade.findMany({
      where: { userId },
    });

    return upgrades.map((upgrade) => {
      const userUpgrade = userUpgrades.find(
        (uu) => uu.upgradeId === upgrade.id,
      );
      return {
        ...upgrade,
        currentLevel: userUpgrade?.level || 0,
        effect: this.calculateEffect(
          upgrade.effect as any,
          userUpgrade?.level || 0,
        ),
      };
    });
  }

  private calculateEffect(effect: any, level: number) {
    switch (effect.type) {
      case 'multiplier':
      case 'addition':
        return effect.baseValue + level * effect.incrementPerLevel;
      // Добавьте другие типы эффектов по необходимости
      default:
        throw new Error('Неизвестный тип эффекта улучшения');
    }
  }
}
