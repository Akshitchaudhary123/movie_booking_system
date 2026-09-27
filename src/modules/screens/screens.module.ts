import { Module } from '@nestjs/common';

import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { AuthModule } from '../auth/auth.module';
import { TheatresModule } from '../theatres/theatres.module';
import { PrismaScreenRepository } from './repositories/prisma-screen.repository';
import { ScreenRepository } from './repositories/screen.repository';
import { ScreensController } from './screens.controller';
import { ScreensService } from './screens.service';

@Module({
  imports: [AuthModule, TheatresModule],
  controllers: [ScreensController],
  providers: [
    ScreensService,
    RolesGuard,
    { provide: ScreenRepository, useClass: PrismaScreenRepository },
  ],
  exports: [ScreensService, ScreenRepository],
})
export class ScreensModule {}
