import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePriceCategoryDto {
    @ApiProperty({ example: "Porchasing Price" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'WH-001' })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ default : false })
    @IsBoolean()
    @IsOptional()
    isPorchasePrice?: boolean;

    
    @ApiProperty({ example: 'asadasd...' })
    @IsString()
    @IsNotEmpty()
    currenciesId: string;

}