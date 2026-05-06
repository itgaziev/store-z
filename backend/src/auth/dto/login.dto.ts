import { User } from "@/users/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: 'john@doe.ru' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class LoginResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    accessToken: string;
    @ApiProperty({ example: { id: 1, email: 'john@doe.ru', firstName: 'John', lastName: 'Doe', role: { id: 1, name: 'user', createdAt: new Date(), updatedAt: new Date() } } })
    user: User;
}