import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Seat } from '@prisma/client';

import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ScreensService } from '../screens/screens.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { SeatRepository } from './repositories/seat.repository';

@Injectable()
export class SeatsService {
  constructor(
    private readonly seatRepository: SeatRepository,
    private readonly screensService: ScreensService,
  ) {}

  async create(data: CreateSeatDto, actor: AuthenticatedUser) {
    await this.screensService.findOne(data.screenId, actor);
    await this.ensurePositionAvailable(data.screenId, data.row, data.number);
    return this.seatRepository.create(data);
  }

  findAll(actor: AuthenticatedUser) {
    return actor.role === 'SUPER_ADMIN'
      ? this.seatRepository.findAll()
      : this.seatRepository.findAllByAdminId(actor.id);
  }

  async findOne(id: string, actor: AuthenticatedUser) {
    const seat = await this.getById(id);
    await this.screensService.findOne(seat.screenId, actor);
    return seat;
  }

  async update(id: string, data: UpdateSeatDto, actor: AuthenticatedUser) {
    const seat = await this.findOne(id, actor);
    const screenId = data.screenId ?? seat.screenId;
    const row = data.row ?? seat.row;
    const number = data.number ?? seat.number;

    await this.screensService.findOne(screenId, actor);
    const duplicate = await this.seatRepository.findByPosition(
      screenId,
      row,
      number,
    );
    if (duplicate && duplicate.id !== id) {
      throw new ConflictException('Seat already exists in this screen');
    }
    return this.seatRepository.update(id, data);
  }

  async remove(id: string, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.seatRepository.updateStatus(id, false);
  }

  private async getById(id: string): Promise<Seat> {
    const seat = await this.seatRepository.findById(id);
    if (!seat) {
      throw new NotFoundException('Seat not found');
    }
    return seat;
  }

  private async ensurePositionAvailable(
    screenId: string,
    row: string,
    number: number,
  ): Promise<void> {
    if (await this.seatRepository.findByPosition(screenId, row, number)) {
      throw new ConflictException('Seat already exists in this screen');
    }
  }
}
