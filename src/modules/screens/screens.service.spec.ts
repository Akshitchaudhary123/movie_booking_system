import { Test, TestingModule } from '@nestjs/testing';
import { ScreensService } from './screens.service';
import { ScreenRepository } from './repositories/screen.repository';
import { TheatresService } from '../theatres/theatres.service';

describe('ScreensService', () => {
  let service: ScreensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScreensService,
        { provide: ScreenRepository, useValue: {} },
        { provide: TheatresService, useValue: {} },
      ],
    }).compile();

    service = module.get<ScreensService>(ScreensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
