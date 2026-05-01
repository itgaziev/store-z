import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class UploadImageDto {
    @ApiProperty({ example: 'product-uuid', description: 'Product UUID' })
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ default: false, required: false })
    @IsOptional()
    isMain?: boolean;

    @ApiProperty({ example: 0, required: false })
    @IsInt()
    @Min(0)
    @Type(() => Number)
    @IsOptional()
    order?: number;
}