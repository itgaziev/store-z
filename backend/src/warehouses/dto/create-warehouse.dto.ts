import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateWarehouseDto {
    @ApiProperty({ example: 'Base Store'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'WH-001'})
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({example: 'MO, Moscow 20021', required: false})
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ default: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}