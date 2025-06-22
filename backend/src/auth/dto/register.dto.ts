import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsOptional } from 'class-validator';

export enum Role {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role; 
}
