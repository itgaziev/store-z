export type SortDirection = 'ASC' | 'DESC';

export type Actions = {
    edit?: (item: any) => void;
    delete?: (item: any) => void;
}