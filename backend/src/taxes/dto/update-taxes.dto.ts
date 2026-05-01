import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateTaxDto {
    @ApiProperty({ example : 'No Taxes'})
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ default: 0, example: 0 })
    @IsNumber()
    @IsOptional()
    percent?: number;

}