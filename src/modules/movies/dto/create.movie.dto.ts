

export type CreateMovieData = {
  title: string;
  language: string;
  genre: string;
  description?: string;
  duration: number;
  releaseDate: Date;
  certificate: string;
};