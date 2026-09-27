import { Theatre } from '@prisma/client';

import { CreateTheatreDto } from '../dto/create-theatre.dto';
import { UpdateTheatreDto } from '../dto/update-theatre.dto';

export abstract class TheatrePrismaRepository {
  abstract create(data: CreateTheatreDto): Promise<Theatre>;

  abstract findById(id: string): Promise<Theatre | null>;

  abstract findAllByAdminId(adminId: string): Promise<Theatre[]>;

  abstract findAll(): Promise<Theatre[]>;

  abstract update(id: string, data: UpdateTheatreDto): Promise<Theatre>;

  abstract updateStatus(id: string, isActive: boolean): Promise<Theatre>;
}
