

import { Injectable } from '@nestjs/common';
import { Movie } from '@prisma/client';

import type { CreateMovieData } from '../dto/create.movie.dto';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { MovieRepository } from './movie.repository';

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

  async findByTitleAndLanguage(title: string, language: string): Promise<Movie | null> {
    
    return this.prisma.prisma.movie.findFirst({
      where:{
        title,language
      }
    })
  }
}