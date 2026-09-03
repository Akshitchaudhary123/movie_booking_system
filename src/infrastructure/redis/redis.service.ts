import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.client = new Redis({
      host: this.configService.getOrThrow<string>('REDIS_HOST'),
      port: this.configService.getOrThrow<number>('REDIS_PORT'),
      password: this.configService.getOrThrow<string>('REDIS_PASSWORD'),

      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    this.registerEvents();
  }

  private registerEvents() {
    this.client.on('connect', () => {
      this.logger.info('Redis connected');
    });

    this.client.on('ready', () => {
      this.logger.info('Redis ready');
    });

    this.client.on('error', (error) => {
      this.logger.error({ err: error }, 'Redis error');
    });

    this.client.on('close', () => {
      this.logger.warn('Redis connection closed');
    });

    this.client.on('reconnecting', () => {
      this.logger.warn('Redis reconnecting...');
    });

    this.client.on('end', () => {
      this.logger.warn('Redis connection ended');
    });
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }
}