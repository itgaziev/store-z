import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { BarcodeTypeEnum } from "../../common/enums/barcodes.enum";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBarcodeDto {
    @ApiProperty({ example: '123456789' })
    @IsString()
    @IsNotEmpty()
    barcode: string;

    @ApiProperty({ example: 'EAN13' })
    @IsEnum(BarcodeTypeEnum)
    type: BarcodeTypeEnum;

    @ApiProperty({ example: 'askjdjks...' })
    @IsUUID()
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 'askjdjks...' })
    @IsUUID()
    @IsOptional()
    offerId?: string;

    @ApiProperty({ example: 'asdskdak...' })
    @IsUUID()
    @IsNotEmpty()
    unitId: string;

    @ApiProperty({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ default: 1.000})
    @IsNumber()
    @IsOptional()
    rate?: number;
}