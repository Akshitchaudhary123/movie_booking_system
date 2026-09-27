import { Test, TestingModule } from '@nestjs/testing';
import { ScreensController } from './screens.controller';
import { ScreensService } from './screens.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles/roles.guard';

describe('ScreensController', () => {
  let controller: ScreensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScreensController],
      providers: [{ provide: ScreensService, useValue: {} }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ScreensController>(ScreensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
