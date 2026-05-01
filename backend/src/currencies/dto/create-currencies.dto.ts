import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCurrenciesDto {
    @ApiProperty({ example: 'rub' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'RUB' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsOptional()
    isBase?: boolean;

    @ApiProperty({ example: 'Russian Ruble' })
    @IsString()
    @IsOptional()
    fullName?: string;

    @ApiProperty({ example: '1.000', default: 1.000 })
    @IsNumber()
    @IsOptional()
    rate: number;

    @ApiProperty({ default: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}