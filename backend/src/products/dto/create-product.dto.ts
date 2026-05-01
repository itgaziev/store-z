import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateProductDto {
    @ApiProperty({ example: 'Product name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Description product', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'SKU-001' })
    @IsString()
    @IsOptional()
    sku?: string;

    @ApiProperty({ example: 'EX-001' })
    @IsString()
    @IsOptional()
    xmlCode?: string;

    @ApiProperty({ example: 'category-uuid', description: 'Category ID' })
    @IsUUID()
    @IsOptional()
    sectionId?: string;

    @ApiProperty({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ description: 'unit id' })
    @IsUUID()
    @IsOptional()
    unitId?: string;
}
