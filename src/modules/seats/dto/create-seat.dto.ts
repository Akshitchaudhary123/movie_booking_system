import { SeatType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateSeatDto {
  @IsString()
  @IsNotEmpty()
  screenId: string;

  @IsString()
  @IsNotEmpty()
  row: string;

  @IsInt()
  @Min(1)
  number: number;

  @IsEnum(SeatType)
  type: SeatType;
}
