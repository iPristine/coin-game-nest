import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { BoostType, UserBoostStatus } from '@prisma/client';

@Injectable()
export class BoostService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async initializeBoosts() {
    const boosts = [
      {
        name: 'test_boost_50',
        nameLabel: 'Получите 50 бесплатных билетов',
        description: 'Получите 50 бесплатных билетов',
        reward: 50,
        type: BoostType.INSTANT,
      },
      {
        name: 'test_boost_delayed_100',
        nameLabel: 'Получите 100 билетов после проверки',
        description: 'Получите 100 билетов после проверки администратором',
        reward: 100,
        type: BoostType.DELAYED,
      },
    ];

    for (const boost of boosts) {
      await this.prisma.boost.upsert({
        where: { name: boost.name },
        update: boost,
        create: boost,
      });
    }
  }

  async getAvailableBoosts(userId: string) {
    const allBoosts = await this.prisma.boost.findMany();
    const userBoosts = await this.prisma.userBoost.findMany({
      where: { userId },
    });

    return allBoosts.map((boost) => ({
      ...boost,
      status:
        userBoosts.find((ub) => ub.boostId === boost.id)?.status || 'available',
    }));
  }

  async useBoost(userId: string, boostId: string) {
    const boost = await this.prisma.boost.findUnique({
      where: { id: boostId },
    });

    if (!boost) {
      throw new HttpException('Boost not found', HttpStatus.BAD_REQUEST);
    }

    const userBoost = await this.prisma.userBoost.findUnique({
      where: { userId_boostId: { userId, boostId } },
    });

    if (userBoost && userBoost.status === UserBoostStatus.COMPLETED) {
      throw new HttpException(
        'Boost already used or not available',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (boost.type === BoostType.INSTANT) {
      await this.prisma.userBoost.upsert({
        where: { userId_boostId: { userId, boostId } },
        update: { status: UserBoostStatus.COMPLETED },
        create: { userId, boostId, status: UserBoostStatus.COMPLETED },
      });

      await this.userService.updateUser({
        where: { id: userId },
        data: { tickets: { increment: boost.reward } },
      });

      return {
        message: `You received ${boost.reward} tickets!`,
        ticketsCount: boost.reward,
      };
    } else if (boost.type === BoostType.DELAYED) {
      const now = new Date();
      const oneDayInMs = 24 * 60 * 60 * 1000;
      const expiresAt = new Date(now.getTime() + oneDayInMs);

      await this.prisma.userBoost.upsert({
        where: { userId_boostId: { userId, boostId } },
        update: {
          status: UserBoostStatus.IN_PROGRESS,
          activatedAt: now,
          expiresAt: expiresAt,
        },
        create: {
          userId,
          boostId,
          status: UserBoostStatus.IN_PROGRESS,
          activatedAt: now,
          expiresAt: expiresAt,
        },
      });

      return {
        message:
          'Your boost has been activated. You can claim your reward after 24 hours.',
      };
    }
  }

  async getAllBoosts(userId: string, showOnlyAvailable: boolean = false) {
    const allBoosts = await this.prisma.boost.findMany();
    const userBoosts = await this.prisma.userBoost.findMany({
      where: { userId },
    });

    const boostsWithStatus = allBoosts.map((boost) => {
      const userBoost = userBoosts.find((ub) => ub.boostId === boost.id);
      return {
        ...boost,
        status: userBoost?.status || 'available',
        expiresAt: userBoost?.expiresAt || null,
      };
    });

    if (showOnlyAvailable) {
      return boostsWithStatus.filter(
        (boost) => boost.status === UserBoostStatus.AVAILABLE,
      );
    }

    return boostsWithStatus;
  }

  async claimDelayedBoost(userId: string, boostId: string) {
    const userBoost = await this.prisma.userBoost.findUnique({
      where: { userId_boostId: { userId, boostId } },
      include: { boost: true },
    });

    if (!userBoost) {
      throw new HttpException('Boost not found', HttpStatus.BAD_REQUEST);
    }

    if (userBoost.status !== UserBoostStatus.IN_PROGRESS) {
      throw new HttpException(
        'Boost is not in progress',
        HttpStatus.BAD_REQUEST,
      );
    }

    const now = new Date();
    if (now < userBoost.expiresAt) {
      throw new HttpException(
        'Boost is not ready to be claimed',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prisma.userBoost.update({
      where: { id: userBoost.id },
      data: { status: UserBoostStatus.COMPLETED },
    });

    await this.userService.updateUser({
      where: { id: userId },
      data: { tickets: { increment: userBoost.boost.reward } },
    });

    return {
      message: `You received ${userBoost.boost.reward} tickets!`,
      ticketsCount: userBoost.boost.reward,
    };
  }
}
