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
import { CreateScreenDto } from './dto/create-screen.dto';
import { UpdateScreenDto } from './dto/update-screen.dto';
import { ScreensService } from './screens.service';

@Controller('screens')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
export class ScreensController {
  constructor(private readonly screensService: ScreensService) {}

  @Post()
  create(
    @Body() data: CreateScreenDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.screensService.create(data, actor);
  }

  @Get()
  findAll(@CurrentUser() actor: AuthenticatedUser) {
    return this.screensService.findAll(actor);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.screensService.findOne(id, actor);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateScreenDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.screensService.update(id, data, actor);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.screensService.remove(id, actor);
  }
}
