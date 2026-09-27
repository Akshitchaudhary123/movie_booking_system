import { Show } from '@prisma/client';

import { CreateShowDto } from '../dto/create-show.dto';
import { UpdateShowDto } from '../dto/update-show.dto';

export abstract class ShowRepository {
  abstract create(data: CreateShowDto): Promise<Show>;
  abstract findById(id: string): Promise<Show | null>;
  abstract findAll(): Promise<Show[]>;
  abstract findAllByAdminId(adminId: string): Promise<Show[]>;
  abstract update(id: string, data: UpdateShowDto): Promise<Show>;
  abstract updateStatus(id: string, isActive: boolean): Promise<Show>;
}
