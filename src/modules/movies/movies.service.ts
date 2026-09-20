import { ConflictException, Injectable } from '@nestjs/common';

import type { CreateMovieData } from './dto/create.movie.dto';
import { MovieRepository } from './repositories/movie.repository';

@Injectable()
export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
  ) {}

  async findById(id: string) {
    return this.movieRepository.findById(id);
  }

  async findAll() {
    return this.movieRepository.findAll();
  }

  async create(dto: CreateMovieData) {
    const existingMovie =
      await this.movieRepository.findByTitleAndLanguage(
        dto.title,
        dto.language,
      );

    if (existingMovie) {
      throw new ConflictException('Movie already exists');
    }

    const movie = await this.movieRepository.create({
      title: dto.title,
      language: dto.language,
      genre: dto.genre,
      description: dto.description,
      duration: dto.duration,
      releaseDate: dto.releaseDate,
      certificate: dto.certificate,
    });

    return {
      message: 'Movie created successfully',
      data: movie,
    };
  }
}