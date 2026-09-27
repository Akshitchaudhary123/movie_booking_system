import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { TheatrePrismaRepository } from './repositories/theatre-prisma.repository.abstract';
import { TheatrePrismaRepositoryImpl } from './repositories/prisma-theatre.repository';
import { TheatresController } from './theatres.controller';
import { TheatresService } from './theatres.service';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  controllers: [TheatresController],
  providers: [
    TheatresService,
    RolesGuard,
    {
      provide: TheatrePrismaRepository,
      useClass: TheatrePrismaRepositoryImpl,
    },
  ],
  exports: [TheatresService, TheatrePrismaRepository],
})
export class TheatresModule {}
