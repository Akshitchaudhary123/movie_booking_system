import { SeatType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateSeatDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  screenId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  row?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  number?: number;

  @IsOptional()
  @IsEnum(SeatType)
  type?: SeatType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
