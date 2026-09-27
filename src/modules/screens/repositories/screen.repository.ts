import { Screen } from '@prisma/client';

import { CreateScreenDto } from '../dto/create-screen.dto';
import { UpdateScreenDto } from '../dto/update-screen.dto';

export abstract class ScreenRepository {
  abstract create(data: CreateScreenDto): Promise<Screen>;
  abstract findById(id: string): Promise<Screen | null>;
  abstract findAll(): Promise<Screen[]>;
  abstract findAllByAdminId(adminId: string): Promise<Screen[]>;
  abstract update(id: string, data: UpdateScreenDto): Promise<Screen>;
  abstract updateStatus(id: string, isActive: boolean): Promise<Screen>;
}
