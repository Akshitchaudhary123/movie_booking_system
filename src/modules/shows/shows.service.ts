import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Show } from '@prisma/client';

import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { MovieService } from '../movies/movies.service';
import { ScreensService } from '../screens/screens.service';
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { ShowRepository } from './repositories/show.repository';

@Injectable()
export class ShowsService {
  constructor(
    private readonly showRepository: ShowRepository,
    private readonly screensService: ScreensService,
    private readonly movieService: MovieService,
  ) {}

  async create(data: CreateShowDto, actor: AuthenticatedUser) {
    await this.validateMovie(data.movieId);
    await this.screensService.findOne(data.screenId, actor);
    this.validateTimes(data.startTime, data.endTime);
    return this.showRepository.create(data);
  }

  findAll(actor: AuthenticatedUser) {
    return actor.role === 'SUPER_ADMIN'
      ? this.showRepository.findAll()
      : this.showRepository.findAllByAdminId(actor.id);
  }

  async findOne(id: string, actor: AuthenticatedUser) {
    const show = await this.getById(id);
    await this.screensService.findOne(show.screenId, actor);
    return show;
  }

  async update(id: string, data: UpdateShowDto, actor: AuthenticatedUser) {
    const show = await this.findOne(id, actor);
    if (data.movieId) {
      await this.validateMovie(data.movieId);
    }
    if (data.screenId) {
      await this.screensService.findOne(data.screenId, actor);
    }
    this.validateTimes(
      data.startTime ?? show.startTime,
      data.endTime ?? show.endTime,
    );
    return this.showRepository.update(id, data);
  }

  async remove(id: string, actor: AuthenticatedUser) {
    await this.findOne(id, actor);
    return this.showRepository.updateStatus(id, false);
  }

  private async getById(id: string): Promise<Show> {
    const show = await this.showRepository.findById(id);
    if (!show) {
      throw new NotFoundException('Show not found');
    }
    return show;
  }

  private async validateMovie(movieId: string): Promise<void> {
    if (!(await this.movieService.findById(movieId))) {
      throw new NotFoundException('Movie not found');
    }
  }

  private validateTimes(startTime: Date, endTime: Date): void {
    if (endTime.getTime() <= startTime.getTime()) {
      throw new BadRequestException('Show end time must be after start time');
    }
  }
}
