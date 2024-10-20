import { Injectable, Inject, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from '../user/user.service'; // Убедитесь, что путь к UserService правильный
import { UpgradeService } from 'src/upgrade/upgrade.service';

type SlotElement = {
  name: string;
  value: number;
};

@Injectable()
export class SlotMachineService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    private readonly upgradeService: UpgradeService,
  ) {}

  private elements: SlotElement[] = [
    { name: 'Apple', value: 1 },
    { name: 'Banana', value: 2 },
    { name: 'Cherry', value: 3 },
    // добавьте другие элементы по необходимости
  ];

  async spin(userId: string) {
    const user = await this.userService.findUserById(userId);

    if (user.tickets <= 0) {
      throw new HttpException('Not enough tickets', HttpStatus.BAD_REQUEST);
    }

    // Уменьшаем количество билетиков
    await this.userService.updateUser({
      where: { id: userId },
      data: { tickets: user.tickets - 1 },
    });

    const positions = this.getRandomElements(3);
    const totalValue = this.calculateTotalValue(positions);
    const multiplier = this.isCombo(positions) ? 3 : 1;

    const upgradeEffect = await this.upgradeService.getUpgradeEffect(
      userId,
      'spinMultiplier',
    );
    const upgradeMultiplier = upgradeEffect.value;

    const resultValue = totalValue * multiplier * upgradeMultiplier;

    // Увеличиваем количество монет
    await this.userService.updateUser({
      where: { id: userId },
      data: { coins: user.coins + resultValue },
    });

    return {
      positions,
      totalValue: resultValue,
      upgradeMultiplier,
    };
  }

  private getRandomElements(count: number) {
    const randomElements: SlotElement[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * this.elements.length);
      randomElements.push(this.elements[randomIndex]);
    }
    return randomElements;
  }

  private calculateTotalValue(elements: { name: string; value: number }[]) {
    return elements.reduce((sum, element) => sum + element.value, 0);
  }

  private isCombo(elements: SlotElement[]) {
    return elements.every((element) => element.name === elements[0].name);
  }
}
