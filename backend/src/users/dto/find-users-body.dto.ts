import {
    IsArray,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FilterOperator, ALL_OPERATORS } from '@/common/enums/filter-operator.enum';

// Allowed filterable fields on the User entity
export type UserFilterKey =
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'patronymic'
    | 'roleId'
    | 'createdAt';

export const USER_FILTER_KEYS: UserFilterKey[] = [
    'firstName',
    'lastName',
    'email',
    'patronymic',
    'roleId',
    'createdAt',
];

export { FilterOperator, ALL_OPERATORS };

export class FilterItemDto {
    @ApiProperty({
        description: 'Field to filter by',
        enum: USER_FILTER_KEYS,
        example: 'firstName',
    })
    @IsString()
    @IsIn(USER_FILTER_KEYS)
    key: UserFilterKey;

    @ApiProperty({
        description: 'Filter operator',
        enum: ALL_OPERATORS,
        example: 'contain',
    })
    @IsString()
    @IsIn(ALL_OPERATORS)
    operator: FilterOperator;

    @ApiProperty({
        description:
            'Filter value. For "between" operator, provide two values separated by "|" (e.g. "2026-01-01|2026-06-28")',
        example: 'Иван',
    })
    @IsString()
    value: string;
}

export class FindUsersBodyDto {
    @ApiProperty({
        description: 'Global search across firstName, lastName, email (OR logic)',
        required: false,
        example: 'Иван',
    })
    @IsOptional()
    @IsString()
    searchTerm?: string;

    @ApiProperty({
        description: 'Array of field-level filters (AND logic)',
        required: false,
        type: [FilterItemDto],
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FilterItemDto)
    filters?: FilterItemDto[];

    @ApiProperty({
        description: 'Field to sort by',
        required: false,
        example: 'createdAt',
    })
    @IsOptional()
    @IsString()
    sort?: string;

    @ApiProperty({
        description: 'Sort direction',
        required: false,
        enum: ['ASC', 'DESC'],
        example: 'DESC',
    })
    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortType?: 'ASC' | 'DESC';

    @ApiProperty({ required: false, example: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({ required: false, example: 10, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}

