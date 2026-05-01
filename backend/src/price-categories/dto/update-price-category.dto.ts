import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdatePriceCategoryDto {
    @ApiProperty({ example: "Porchasing Price" })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'WH-001' })
    @IsString()
    @IsOptional()
    code?: string;

    @ApiProperty({ default: false })
    @IsBoolean()
    @IsOptional()
    isPorchasePrice?: boolean;

    @ApiProperty({ example: 'asadasd...' })
    @IsString()
    @IsOptional()
    currenciesId?: string;
}