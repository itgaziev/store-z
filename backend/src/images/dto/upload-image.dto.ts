import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from "class-validator";

export class UploadImageDto {
    @ApiProperty({ example: 'product-uuid', description: 'Product UUID' })
    @IsNumber()
    @IsNotEmpty()
    productId: number;

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