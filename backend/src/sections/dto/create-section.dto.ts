import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateSectionDto {
    @ApiProperty({ example: 'Category Name'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Category description', required: false})
    @IsString()
    @IsOptional()
    description?: string

    @ApiProperty({ required: false, description: 'Parent section ID for nested sections'})
    @IsUUID()
    @IsOptional()
    parentId?: string;
}