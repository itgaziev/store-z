import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { BarcodeTypeEnum } from "../../common/enums/barcodes.enum";
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

    @ApiProperty({ example: 'asdskdak...' })
    @IsUUID()
    @IsOptional()
    unitId?: string;

    @ApiProperty({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ default: 1.000})
    @IsNumber()
    @IsOptional()
    rate?: number;
}