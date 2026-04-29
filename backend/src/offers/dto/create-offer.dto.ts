import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateOfferDto {
    @ApiProperty({ example: 'Offer name'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'product-uuid', description: 'Product ID'})
    @IsUUID()
    @IsNotEmpty()
    parentId: string;

    @ApiProperty({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ example: 'ext_code_offer', description: 'External offer code'})
    @IsString()
    @IsOptional()
    xmlCode: string;
}