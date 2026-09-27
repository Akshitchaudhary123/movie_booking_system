import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Theatre } from '@prisma/client';

import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { UserService } from '../users/users.service';
import { CreateTheatreDto } from './dto/create-theatre.dto';
import { UpdateTheatreDto } from './dto/update-theatre.dto';
import { TheatrePrismaRepository } from './repositories/theatre-prisma.repository.abstract';

@Injectable()
export class TheatresService {
  constructor(
    private readonly theatreRepository: TheatrePrismaRepository,
    private readonly userService: UserService,
  ) {}

  async create(data: CreateTheatreDto) {
    await this.validateAdmin(data.adminId);
    return this.theatreRepository.create(data);
  }

  async findAll(actor: AuthenticatedUser) {
    if (actor.role === 'SUPER_ADMIN') {
      return this.theatreRepository.findAll();
    }
    return this.theatreRepository.findAllByAdminId(actor.id);
  }

  async findOne(id: string, actor: AuthenticatedUser) {
    const theatre = await this.getById(id);
    this.assertCanManage(theatre, actor);
    return theatre;
  }

  async update(id: string, data: UpdateTheatreDto, actor: AuthenticatedUser) {
    const theatre = await this.getById(id);
    this.assertCanManage(theatre, actor);

    if (data.adminId) {
      if (actor.role !== 'SUPER_ADMIN') {
        throw new ForbiddenException('Only SUPER_ADMIN can reassign a theatre');
      }
      await this.validateAdmin(data.adminId);
    }

    return this.theatreRepository.update(id, data);
  }

  async remove(id: string, actor: AuthenticatedUser) {
    const theatre = await this.getById(id);
    this.assertCanManage(theatre, actor);
    return this.theatreRepository.updateStatus(id, false);
  }

  async getById(id: string): Promise<Theatre> {
    const theatre = await this.theatreRepository.findById(id);
    if (!theatre) {
      throw new NotFoundException('Theatre not found');
    }
    return theatre;
  }

  assertCanManage(theatre: Theatre, actor: AuthenticatedUser): void {
    if (actor.role !== 'SUPER_ADMIN' && theatre.adminId !== actor.id) {
      throw new ForbiddenException('You cannot manage this theatre');
    }
  }

  private async validateAdmin(adminId: string): Promise<void> {
    const admin = await this.userService.findByIdWithRole(adminId);
    if (!admin || admin.role.name !== 'ADMIN') {
      throw new NotFoundException('Admin not found');
    }
  }
}
