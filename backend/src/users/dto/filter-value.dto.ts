import { DateFilterDto, StringFilterDto } from '@/common/dto/filter.dto';

export { StringFilterDto, DateFilterDto };

/**
 * Represents a parsed `filters` object sent by the frontend.
 * Each key corresponds to a filterable field on the User entity.
 *
 * String fields use { operator, value } shape.
 * roleId is a plain UUID string.
 */
export interface UserFilters {
    firstName?: StringFilterDto;
    lastName?: StringFilterDto;
    email?: StringFilterDto;
    patronymic?: StringFilterDto;
    createdAt?: DateFilterDto;
    /** Plain UUID — no operator wrapper */
    roleId?: string;
}

