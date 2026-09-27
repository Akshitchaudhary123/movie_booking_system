import { Test, TestingModule } from '@nestjs/testing';

import { TheatrePrismaRepository } from './repositories/theatre-prisma.repository.abstract';
import { TheatresService } from './theatres.service';
import { UserService } from '../users/users.service';

describe('TheatresService', () => {
  let service: TheatresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TheatresService,
        {
          provide: TheatrePrismaRepository,
          useValue: {},
        },
        { provide: UserService, useValue: {} },
      ],
    }).compile();

    service = module.get<TheatresService>(TheatresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
