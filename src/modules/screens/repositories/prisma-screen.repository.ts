import { Injectable } from '@nestjs/common';
import { Screen } from '@prisma/client';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateScreenDto } from '../dto/create-screen.dto';
import { UpdateScreenDto } from '../dto/update-screen.dto';
import { ScreenRepository } from './screen.repository';

@Injectable()
export class PrismaScreenRepository extends ScreenRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  create(data: CreateScreenDto): Promise<Screen> {
    return this.prisma.prisma.screen.create({ data });
  }

  findById(id: string): Promise<Screen | null> {
    return this.prisma.prisma.screen.findUnique({ where: { id } });
  }

  findAll(): Promise<Screen[]> {
    return this.prisma.prisma.screen.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findAllByAdminId(adminId: string): Promise<Screen[]> {
    return this.prisma.prisma.screen.findMany({
      where: { theatre: { adminId } },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: string, data: UpdateScreenDto): Promise<Screen> {
    return this.prisma.prisma.screen.update({ where: { id }, data });
  }

  updateStatus(id: string, isActive: boolean): Promise<Screen> {
    return this.prisma.prisma.screen.update({
      where: { id },
      data: { isActive },
    });
  }
}
