import { Injectable } from '@nestjs/common';

type SlotElement = {
  name: string;
  value: number;
};

@Injectable()
export class SlotMachineService {
  private elements: SlotElement[] = [
    { name: 'Apple', value: 1 },
    { name: 'Banana', value: 2 },
    { name: 'Cherry', value: 3 },
    // добавьте другие элементы по необходимости
  ];

  spin() {
    const positions = this.getRandomElements(3);
    const totalValue = this.calculateTotalValue(positions);
    const multiplier = this.isCombo(positions) ? 3 : 1;
    const resultValue = totalValue * multiplier;

    return {
      positions,
      totalValue: resultValue,
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
