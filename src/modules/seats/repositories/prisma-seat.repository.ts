import { Injectable } from '@nestjs/common';
import { Seat } from '@prisma/client';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CreateSeatDto } from '../dto/create-seat.dto';
import { UpdateSeatDto } from '../dto/update-seat.dto';
import { SeatRepository } from './seat.repository';

@Injectable()
export class PrismaSeatRepository extends SeatRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  create(data: CreateSeatDto): Promise<Seat> {
    return this.prisma.prisma.seat.create({ data });
  }

  findById(id: string): Promise<Seat | null> {
    return this.prisma.prisma.seat.findUnique({ where: { id } });
  }

  findByPosition(
    screenId: string,
    row: string,
    number: number,
  ): Promise<Seat | null> {
    return this.prisma.prisma.seat.findUnique({
      where: { screenId_row_number: { screenId, row, number } },
    });
  }

  findAll(): Promise<Seat[]> {
    return this.prisma.prisma.seat.findMany({ orderBy: { createdAt: 'desc' } });
  }

  findAllByAdminId(adminId: string): Promise<Seat[]> {
    return this.prisma.prisma.seat.findMany({
      where: { screen: { theatre: { adminId } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  update(id: string, data: UpdateSeatDto): Promise<Seat> {
    return this.prisma.prisma.seat.update({ where: { id }, data });
  }

  updateStatus(id: string, isActive: boolean): Promise<Seat> {
    return this.prisma.prisma.seat.update({
      where: { id },
      data: { isActive },
    });
  }
}
