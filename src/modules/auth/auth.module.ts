import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
    ConfigModule,
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtAuthGuard],
  exports: [AuthService, TokenService, JwtAuthGuard],
})
export class AuthModule {}