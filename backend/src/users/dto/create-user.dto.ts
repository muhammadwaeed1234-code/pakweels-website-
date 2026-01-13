import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string; // Plain text password, will be hashed in service

    @IsNotEmpty()
    firstName: string;

    lastName?: string;
}
