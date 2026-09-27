import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateTheatreDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  @Length(6, 6)
  pincode?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  adminId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
