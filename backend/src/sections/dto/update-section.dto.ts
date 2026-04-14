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

    @ApiProperty({ required: false, description: 'Parent section ID for nested sections'})
    @IsNumber()
    @IsOptional()
    parentId?: number;
}