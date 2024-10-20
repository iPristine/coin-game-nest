import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketService {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  async claimTickets(
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const lastClaimTime = user.lastTicketClaim;
    const currentTime = new Date();

    if (
      lastClaimTime &&
      currentTime.getTime() - lastClaimTime.getTime() < 3600000
    ) {
      const timeLeft = Math.ceil(
        (3600000 - (currentTime.getTime() - lastClaimTime.getTime())) / 60000,
      );
      throw new HttpException(
        `You can claim tickets after ${timeLeft} minutes`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        tickets: { increment: 5 },
        lastTicketClaim: currentTime,
      },
    });

    return { success: true, message: 'You have received 5 tickets' };
  }
}
