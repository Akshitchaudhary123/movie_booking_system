import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTheatreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  pincode: string;

  @IsString()
  @IsNotEmpty()
  adminId: string;
}
