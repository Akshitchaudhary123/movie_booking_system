import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateScreenDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  theatreId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
