import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MoviesModule } from './modules/movies/movies.module';
import { TheatresModule } from './modules/theatres/theatres.module';
import { ScreensModule } from './modules/screens/screens.module';
import { ShowsModule } from './modules/shows/shows.module';
import { SeatsModule } from './modules/seats/seats.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AppLoggerModule } from './infrastructure/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
     UsersModule,
      MoviesModule,
       TheatresModule,
        ScreensModule,
         ShowsModule,
          SeatsModule,
           BookingsModule,
            PaymentsModule,
             NotificationsModule,
              AppLoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}