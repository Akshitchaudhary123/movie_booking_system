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
import { CreateShowDto } from './dto/create-show.dto';
import { UpdateShowDto } from './dto/update-show.dto';
import { ShowsService } from './shows.service';

@Controller('shows')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  @Post()
  create(@Body() data: CreateShowDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.showsService.create(data, actor);
  }

  @Get()
  findAll(@CurrentUser() actor: AuthenticatedUser) {
    return this.showsService.findAll(actor);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.showsService.findOne(id, actor);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateShowDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.showsService.update(id, data, actor);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.showsService.remove(id, actor);
  }
}
