import { Movie } from '@prisma/client';

export type CreateMovieData = {
  title: string;
  language: string;
  genre: string;
  description?: string;
  duration: number;
  releaseDate: Date;
  certificate: string;
};

export abstract class MovieRepository {
  abstract findById(id: string): Promise<Movie | null>;

  abstract findAll(): Promise<Movie[]>;

  abstract create(data: CreateMovieData): Promise<Movie>;
}