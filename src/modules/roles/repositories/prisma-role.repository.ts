import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { RoleRepository } from './role.repository';

@Injectable()
export class PrismaRoleRepository extends RoleRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async findByName(name: string): Promise<Role | null> {
    return this.prismaService.prisma.role.findUnique({
      where: {
        name
      },
    });
  }

  async findById(id: string): Promise<Role | null> {
    return this.prismaService.prisma.role.findUnique({
      where: {
        id
      },
    });
  }
}