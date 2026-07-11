import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { loggerConfig } from './logger.config';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      useFactory: () => loggerConfig,
    }),
  ],
  exports: [PinoLoggerModule],
})
export class AppLoggerModule {}
