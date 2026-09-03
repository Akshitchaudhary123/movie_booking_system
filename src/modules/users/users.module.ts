import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserRepository } from './repositories/user.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports:[UserRepository]
})
export class UsersModule {}
