import { Injectable } from '@nestjs/common';
import { Theatre } from '@prisma/client';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { TheatrePrismaRepository } from './theatre-prisma.repository.abstract';
import { CreateTheatreDto } from '../dto/create-theatre.dto';
import { UpdateTheatreDto } from '../dto/update-theatre.dto';

@Injectable()
export class TheatrePrismaRepositoryImpl extends TheatrePrismaRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(data: CreateTheatreDto): Promise<Theatre> {
    return this.prisma.prisma.theatre.create({
      data,
    });
  }

  async findById(id: string): Promise<Theatre | null> {
    return this.prisma.prisma.theatre.findUnique({
      where: {
        id,
      },
    });
  }

  async findAllByAdminId(adminId: string): Promise<Theatre[]> {
    return this.prisma.prisma.theatre.findMany({
      where: { adminId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findAll(): Promise<Theatre[]> {
    return this.prisma.prisma.theatre.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: string, data: UpdateTheatreDto): Promise<Theatre> {
    return this.prisma.prisma.theatre.update({
      where: {
        id,
      },
      data,
    });
  }

  async updateStatus(id: string, isActive: boolean): Promise<Theatre> {
    return this.prisma.prisma.theatre.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    });
  }
}
