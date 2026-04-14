import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateWarehouseDto {
    @ApiProperty({ example: 'Base Store'})
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'WH-001'})
    @IsString()
    @IsOptional()
    code?: string;

    @ApiProperty({example: 'MO, Moscow 20021', required: false})
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ default: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}