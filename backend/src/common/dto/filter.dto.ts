import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';

export type StringOperator = 'equal' | 'contain' | 'not-contain' | 'not-equal';
export type DateOperator = 'less' | 'more' | 'between';

export class StringFilterDto {
    @IsIn(['equal', 'contain', 'not-contain', 'not-equal'])
    operator: StringOperator;

    @IsString()
    value: string;
}

export class DateFilterDto {
    @IsIn(['less', 'more', 'between'])
    operator: DateOperator;

    @IsDateString()
    value: string;

    @IsOptional()
    @IsDateString()
    valueTo?: string;
}
