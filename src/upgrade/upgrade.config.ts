export const UPGRADES = [
  {
    name: 'spinMultiplier',
    description: 'Увеличивает множитель выигрыша при вращении',
    baseCost: 10,
    costMultiplier: 1.5,
    effect: {
      type: 'multiplier',
      baseValue: 1,
      incrementPerLevel: 0.1,
    },
  },
  {
    name: 'ticketBonus',
    description: 'Увеличивает количество получаемых билетов',
    baseCost: 20,
    costMultiplier: 1.3,
    effect: {
      type: 'addition',
      baseValue: 0,
      incrementPerLevel: 1,
    },
  },
  // Добавьте другие виды улучшений по необходимости
];
