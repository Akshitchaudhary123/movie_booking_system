import { Seat } from '@prisma/client';

import { CreateSeatDto } from '../dto/create-seat.dto';
import { UpdateSeatDto } from '../dto/update-seat.dto';

export abstract class SeatRepository {
  abstract create(data: CreateSeatDto): Promise<Seat>;
  abstract findById(id: string): Promise<Seat | null>;
  abstract findByPosition(
    screenId: string,
    row: string,
    number: number,
  ): Promise<Seat | null>;
  abstract findAll(): Promise<Seat[]>;
  abstract findAllByAdminId(adminId: string): Promise<Seat[]>;
  abstract update(id: string, data: UpdateSeatDto): Promise<Seat>;
  abstract updateStatus(id: string, isActive: boolean): Promise<Seat>;
}
