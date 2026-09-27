import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Roles } from 'src/common/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { CreateTheatreDto } from './dto/create-theatre.dto';
import { UpdateTheatreDto } from './dto/update-theatre.dto';
import { TheatresService } from './theatres.service';

@Controller('theatres')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
export class TheatresController {
  constructor(private readonly theatresService: TheatresService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  create(@Body() data: CreateTheatreDto) {
    return this.theatresService.create(data);
  }

  @Get()
  findAll(@CurrentUser() actor: AuthenticatedUser) {
    return this.theatresService.findAll(actor);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.theatresService.findOne(id, actor);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateTheatreDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.theatresService.update(id, data, actor);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.theatresService.remove(id, actor);
  }
}
