import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { BarcodeTypeEnum } from "../barcodes.type";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateBarcodeDto {
    @ApiProperty({ example: '123456789'})
    @IsString()
    @IsOptional()
    barcode?: string;

    @ApiProperty({ example: 'EAN13'})
    @IsEnum(BarcodeTypeEnum)
    @IsOptional()
    type?: BarcodeTypeEnum;

    @ApiProperty({ example: 'askjdjks...'})
    @IsUUID()
    @IsOptional()
    productId?: string;

    @ApiProperty({ example: 'askjdjks...'})
    @IsUUID()
    @IsOptional()
    offerId?: string;

    @ApiProperty({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}