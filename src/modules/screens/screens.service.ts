import { Injectable, NotFoundException } from '@nestjs/common';
import { Screen } from '@prisma/client';

import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { TheatresService } from '../theatres/theatres.service';
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { ScreenRepository } from './repositories/screen.repository';

@Injectable()
export class ScreensService {
  constructor(
    private readonly screenRepository: ScreenRepository,
    private readonly theatresService: TheatresService,
  ) {}

  async create(data: CreateScreenDto, actor: AuthenticatedUser) {
    await this.theatresService.findOne(data.theatreId, actor);
    return this.screenRepository.create(data);
  }

  findAll(actor: AuthenticatedUser) {
    return actor.role === 'SUPER_ADMIN'
      ? this.screenRepository.findAll()
      : this.screenRepository.findAllByAdminId(actor.id);
  }

  async findOne(id: string, actor: AuthenticatedUser) {
    const screen = await this.getById(id);
    await this.theatresService.findOne(screen.theatreId, actor);
    return screen;
  }

  async update(id: string, data: UpdateScreenDto, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    if (data.theatreId) {
      await this.theatresService.findOne(data.theatreId, actor);
    }
    return this.screenRepository.update(id, data);
  }

  async remove(id: string, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.screenRepository.updateStatus(id, false);
  }

  async getById(id: string): Promise<Screen> {
    const screen = await this.screenRepository.findById(id);
    if (!screen) {
      throw new NotFoundException('Screen not found');
    }
    return screen;
  }
}
