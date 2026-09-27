import { Test, TestingModule } from '@nestjs/testing';

import { TheatresController } from './theatres.controller';
import { TheatresService } from './theatres.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';

describe('TheatresController', () => {
  let controller: TheatresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TheatresController],
      providers: [
        {
          provide: TheatresService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TheatresController>(TheatresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
