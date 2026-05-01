import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUnitDto {
    @ApiProperty({ example: '796'})
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({ example: 'шт'})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Штука'})
    fullName: string;
}