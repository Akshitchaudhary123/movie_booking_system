import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserRepository } from './repositories/user.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { UserService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    UserService
  ],
  exports:[UserService]
})
export class UsersModule {}
