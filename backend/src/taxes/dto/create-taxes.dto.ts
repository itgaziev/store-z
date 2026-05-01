import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTaxDto {
    @ApiProperty({ example : 'No Taxes'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ default: 0, example: 0 })
    @IsNumber()
    @IsOptional()
    percent?: number;

}