import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import type { CreateMovieData } from './dto/create.movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MovieService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly movieService: MovieService,
  ) {}

  @Get()
  async findAll() {
    return this.movieService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.movieService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: CreateMovieData) {
    return this.movieService.create(data);
  }
}