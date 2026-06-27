export interface IPaginationMeta {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
}

export interface IPaginatedResponse<T> {
    data: T[];
    meta: IPaginationMeta;
}