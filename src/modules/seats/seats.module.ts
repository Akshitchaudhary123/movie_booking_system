import { Module } from '@nestjs/common';

import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { AuthModule } from '../auth/auth.module';
import { ScreensModule } from '../screens/screens.module';
import { PrismaSeatRepository } from './repositories/prisma-seat.repository';
import { SeatRepository } from './repositories/seat.repository';
import { SeatsController } from './seats.controller';
import { SeatsService } from './seats.service';

@Module({
  imports: [AuthModule, ScreensModule],
  controllers: [SeatsController],
  providers: [
    SeatsService,
    RolesGuard,
    { provide: SeatRepository, useClass: PrismaSeatRepository },
  ],
})
export class SeatsModule {}
