import { Module } from '@nestjs/common';

import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { AuthModule } from '../auth/auth.module';
import { MoviesModule } from '../movies/movies.module';
import { ScreensModule } from '../screens/screens.module';
import { PrismaShowRepository } from './repositories/prisma-show.repository';
import { ShowRepository } from './repositories/show.repository';
import { ShowsController } from './shows.controller';
import { ShowsService } from './shows.service';

@Module({
  imports: [AuthModule, MoviesModule, ScreensModule],
  controllers: [ShowsController],
  providers: [
    ShowsService,
    RolesGuard,
    { provide: ShowRepository, useClass: PrismaShowRepository },
  ],
})
export class ShowsModule {}
