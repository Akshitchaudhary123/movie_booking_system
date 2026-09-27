import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateShowDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  movieId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  screenId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startTime?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endTime?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
