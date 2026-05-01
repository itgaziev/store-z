import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUnitDto {
    @ApiProperty({ example: '796' })
    @IsString()
    @IsOptional()
    code?: string;

    @ApiProperty({ example: 'шт' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'Штука' })
    @IsString()
    @IsOptional()
    fullName?: string;
}