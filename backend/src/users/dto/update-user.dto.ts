import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string;

    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    patronymic?: string;

    @IsUUID()
    @IsOptional()
    roleId?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}