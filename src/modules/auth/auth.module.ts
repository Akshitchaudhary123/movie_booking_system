import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
    ConfigModule,
    RolesModule
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, JwtStrategy],
  exports: [AuthService, TokenService],
})
export class AuthModule {}