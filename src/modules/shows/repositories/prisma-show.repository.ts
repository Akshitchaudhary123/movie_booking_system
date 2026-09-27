import { Injectable } from '@nestjs/common';
import { Show } from '@prisma/client';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateShowDto } from '../dto/create-show.dto';
import { UpdateShowDto } from '../dto/update-show.dto';
import { ShowRepository } from './show.repository';

@Injectable()
export class PrismaShowRepository extends ShowRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  create(data: CreateShowDto): Promise<Show> {
    return this.prisma.prisma.show.create({ data });
  }

  findById(id: string): Promise<Show | null> {
    return this.prisma.prisma.show.findUnique({ where: { id } });
  }

  findAll(): Promise<Show[]> {
    return this.prisma.prisma.show.findMany({ orderBy: { startTime: 'asc' } });
  }

  findAllByAdminId(adminId: string): Promise<Show[]> {
    return this.prisma.prisma.show.findMany({
      where: { screen: { theatre: { adminId } } },
      orderBy: { startTime: 'asc' },
    });
  }

  update(id: string, data: UpdateShowDto): Promise<Show> {
    return this.prisma.prisma.show.update({ where: { id }, data });
  }

  updateStatus(id: string, isActive: boolean): Promise<Show> {
    return this.prisma.prisma.show.update({
      where: { id },
      data: { isActive },
    });
  }
}
