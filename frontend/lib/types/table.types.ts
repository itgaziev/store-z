export type SortDirection = 'ASC' | 'DESC';

export type Actions = {
    edit?: (item: any) => void;
    delete?: (item: any) => void;
}


export interface Column {
    id: string;
    title: string;
    width: number | string;
    show: boolean;
    sortable: boolean;
}
export interface TableData {
    columns: Column[];
    rows: Record<string, any>[];
}
