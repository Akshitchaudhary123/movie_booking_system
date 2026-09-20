import { Movie } from '@prisma/client';

import type { CreateMovieData } from '../dto/create.movie.dto';

export abstract class MovieRepository {

  abstract findById(id: string): Promise<Movie | null>;

  abstract findAll(): Promise<Movie[]>;

  abstract create(data: CreateMovieData): Promise<Movie>;

  abstract findByTitleAndLanguage(title: string,language: string): Promise<Movie | null>;

}