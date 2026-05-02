import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUnitDto {
    @ApiProperty({ example: '796'})
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'шт'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Штука'})
    @IsString()
    @IsOptional()
    fullName?: string;
}