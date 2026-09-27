import { Test, TestingModule } from '@nestjs/testing';
import { SeatsService } from './seats.service';
import { SeatRepository } from './repositories/seat.repository';
import { ScreensService } from '../screens/screens.service';

describe('SeatsService', () => {
  let service: SeatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeatsService,
        { provide: SeatRepository, useValue: {} },
        { provide: ScreensService, useValue: {} },
      ],
    }).compile();

    service = module.get<SeatsService>(SeatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
