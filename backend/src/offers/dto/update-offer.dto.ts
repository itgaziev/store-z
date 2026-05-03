import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateOfferDto {
    @ApiProperty({ example: 'Offer name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ default: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ example: 'ext_code_offer', description: 'External offer code' })
    @IsString()
    @IsOptional()
    xmlCode?: string;
}