import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { RedisService } from '../../../infrastructure/redis/redis.service';
import { JWT } from '../constants/auth.constants';
import {
  AUTH_CACHE_KEYS,
  AUTH_CACHE_TTL,
} from '../constants/auth-cache.constants';

export interface TokenPayload {
  sub: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  generateTokens(userId: string): Tokens {
    const payload: TokenPayload = { sub: userId };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: JWT.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: JWT.REFRESH_TOKEN_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async storeRefreshToken(userId: string, refreshToken: string): Promise<void> {
    const key = AUTH_CACHE_KEYS.REFRESH_TOKEN(userId);
    await this.redisService.getClient().set(key, refreshToken, 'EX', AUTH_CACHE_TTL.REFRESH_TOKEN);
  }

  async verifyRefreshToken(refreshToken: string): Promise<TokenPayload> {
    try {
      const payload = this.jwtService.verify<TokenPayload>(refreshToken, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });

      const storedToken = await this.redisService
        .getClient()
        .get(AUTH_CACHE_KEYS.REFRESH_TOKEN(payload.sub));

      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    const key = AUTH_CACHE_KEYS.REFRESH_TOKEN(userId);
    await this.redisService.getClient().del(key);
  }
}