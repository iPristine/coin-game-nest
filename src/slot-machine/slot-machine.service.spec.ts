import { Test, TestingModule } from '@nestjs/testing';
import { SlotMachineService } from './slot-machine.service';

describe('SlotMachineService', () => {
  let service: SlotMachineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlotMachineService],
    }).compile();

    service = module.get<SlotMachineService>(SlotMachineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return 3 random elements', () => {
    const result = service.spin();
    expect(result.positions).toHaveLength(3);
  });

  it('should multiply the total value by 3 if all elements are the same', () => {
    jest.spyOn(service, 'getRandomElements' as any).mockImplementation(() => [
      { name: 'Cherry', value: 30 },
      { name: 'Cherry', value: 30 },
      { name: 'Cherry', value: 30 },
    ]);
    const result = service.spin();
    expect(result.totalValue).toBe(270); // 30 * 3 * 3
  });

  it('should not multiply the total value if elements are different', () => {
    jest.spyOn(service, 'getRandomElements' as any).mockImplementation(() => [
      { name: 'Apple', value: 10 },
      { name: 'Banana', value: 20 },
      { name: 'Cherry', value: 30 },
    ]);
    const result = service.spin();
    expect(result.totalValue).toBe(60); // 10 + 20 + 30
  });

  it('should correctly identify if all elements are the same', () => {
    const elements = [
      { name: 'Cherry', value: 30 },
      { name: 'Cherry', value: 30 },
      { name: 'Cherry', value: 30 },
    ];
    const isCombo = (service as any).isCombo(elements);
    expect(isCombo).toBe(true);
  });

  it('should correctly identify if elements are different', () => {
    const elements = [
      { name: 'Apple', value: 10 },
      { name: 'Banana', value: 20 },
      { name: 'Cherry', value: 30 },
    ];
    const isCombo = (service as any).isCombo(elements);
    expect(isCombo).toBe(false);
  });
});
