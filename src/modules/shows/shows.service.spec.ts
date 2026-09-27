import { Test, TestingModule } from '@nestjs/testing';
import { ShowsService } from './shows.service';
import { ShowRepository } from './repositories/show.repository';
import { ScreensService } from '../screens/screens.service';
import { MovieService } from '../movies/movies.service';

describe('ShowsService', () => {
  let service: ShowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowsService,
        { provide: ShowRepository, useValue: {} },
        { provide: ScreensService, useValue: {} },
        { provide: MovieService, useValue: {} },
      ],
    }).compile();

    service = module.get<ShowsService>(ShowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
