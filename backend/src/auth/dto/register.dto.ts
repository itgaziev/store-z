import { User } from "@/users/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: 'john@doe.ru'})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123'})
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'John'})
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe'})
    @IsString()
    @IsNotEmpty()
    lastName: string;
}

export class RegisterResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    access_token: string;
    @ApiProperty({ example: '3600s' })
    expires_in: string;
    @ApiProperty({ example: { id: 1, email: 'john@doe.ru', firstName: 'John', lastName: 'Doe', role: { id: 1, name: 'user', createdAt: new Date(), updatedAt: new Date() } } })
    user: User;
}