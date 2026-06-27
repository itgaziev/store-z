import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class FindUsersQueryDto extends PaginationDto {
    @IsOptional()
    @IsString()
    sortBy: string = 'createdAt';

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    order: 'ASC' | 'DESC' = 'DESC';

    /** Global search across firstName, lastName, email (OR logic). */
    @IsOptional()
    @IsString()
    searchTerm?: string;

    /**
     * JSON-encoded object of precise field filters (AND logic).
     * Example:
     * {
     *   "firstName": { "operator": "contain", "value": "Иван" },
     *   "createdAt": { "operator": "between", "value": "2026-01-01T00:00:00", "valueTo": "2026-06-24T23:59:59" },
     *   "roleId": "c9d4cacf-a0d1-4c84-9c67-a527ca776985"
     * }
     */
    @IsOptional()
    @IsString()
    filters?: string;
}
