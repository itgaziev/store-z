import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateSectionDto {
    @ApiProperty({ example: 'Category Name'})
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'Category description', required: false})
    @IsString()
    @IsOptional()
    description?: string

    @ApiProperty({ example: 'Category code', required: false})
    @IsString()
    @IsOptional()
    code?: string

    @ApiProperty({ required: false, description: 'Parent section ID for nested sections'})
    @IsUUID()
    @IsOptional()
    parentId?: string;
}