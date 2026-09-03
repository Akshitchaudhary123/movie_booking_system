import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AppLoggerModule } from '../logger/logger.module';

@Global()
@Module({
  imports: [AppLoggerModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
