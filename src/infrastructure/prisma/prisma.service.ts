import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  public prisma: PrismaClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    const databaseUrl =
      this.configService.getOrThrow<string>('DATABASE_URL');

    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },

      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });

    const prismaClient = this.prisma as any;

    prismaClient.$on('query', (event: any) => {
      this.logger.debug(
        {
          query: event.query,
          params: event.params,
          duration: `${event.duration}ms`,
        },
        'Prisma Query',
      );
    });

    prismaClient.$on('info', (event: any) => {
      this.logger.info(event.message, 'Prisma Info');
    });

    prismaClient.$on('warn', (event: any) => {
      this.logger.warn(event.message, 'Prisma Warn');
    });

    prismaClient.$on('error', (event: any) => {
      this.logger.error(
        { err: event.message },
        'Prisma Error',
      );
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.prisma.$connect();

      this.logger.info(
        'Successfully connected to PostgreSQL database',
      );
    } catch (error) {
      this.logger.error(
        { err: error },
        'Failed to connect to PostgreSQL database',
      );

      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.prisma.$disconnect();

    this.logger.info(
      'Disconnected from PostgreSQL database',
    );
  }
}