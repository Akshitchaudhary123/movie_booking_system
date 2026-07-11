import { Module } from '@nestjs/common';
import { TheatresService } from './theatres.service';
import { TheatresController } from './theatres.controller';

@Module({
  controllers: [TheatresController],
  providers: [TheatresService],
})
export class TheatresModule {}
