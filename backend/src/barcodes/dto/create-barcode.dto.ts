import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { BarcodeTypeEnum } from "../barcodes.type";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBarcodeDto {
    @ApiProperty({ example: '123456789'})
    @IsString()
    @IsNotEmpty()
    barcode: string;

    @ApiProperty({ example: 'EAN13'})
    @IsEnum(BarcodeTypeEnum)
    type: BarcodeTypeEnum;

    @ApiProperty({ example: 'askjdjks...'})
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 'askjdjks...'})
    @IsUUID()
    @IsOptional()
    offerId?: string;

    @ApiProperty({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}