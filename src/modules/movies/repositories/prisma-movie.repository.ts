

import { Injectable } from '@nestjs/common';
import { Movie } from '@prisma/client';

import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  CreateMovieData,
  MovieRepository,
} from './movie.repository';

@Injectable()
export class PrismaMovieRepository extends MovieRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super();
  }

  async findById(id: string): Promise<Movie | null> {
    return this.prisma.prisma.movie.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll(): Promise<Movie[]> {
    return this.prisma.prisma.movie.findMany();
  }

  async create(data: CreateMovieData): Promise<Movie> {
    return this.prisma.prisma.movie.create({
      data,
    });
  }
}