import { Test, TestingModule } from '@nestjs/testing';

import { PartitionScheduleService } from './partition-schedule.service';

describe('PartitionScheduleService', () => {
  let service: PartitionScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartitionScheduleService],
    }).compile();

    service = module.get<PartitionScheduleService>(PartitionScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
