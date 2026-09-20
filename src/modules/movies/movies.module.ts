import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersModule } from '../users/users.module';
import { MoviesController } from './movies.controller';
import { MovieService } from './movies.service';
import { MovieRepository } from './repositories/movie.repository';
import { PrismaMovieRepository } from './repositories/prisma-movie.repository';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  controllers: [MoviesController],
  providers: [
    MovieService,
    // JwtAuthGuard,
    {
      provide: MovieRepository,
      useClass: PrismaMovieRepository,
    },
  ],
  exports: [MovieService,
    //  JwtAuthGuard
    ],
})
export class MoviesModule {}
