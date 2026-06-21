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

export interface IFilterTableOption {
    value: string | number;
    label: string;
}

export interface IFilterTable {
    id: string;
    title: string;
    type: 'STRING' | 'SELECT' | 'CHECKBOX' | 'MODAL';
    endpoint?: string; // Для SELECT и MODAL, откуда качать данные
    
    // Новые полезные поля:
    placeholder?: string;
    // Ключи, которые нужно вытащить из ответа бэкенда для отображения
    bindLabel?: string; // например, 'name' или 'email'
    bindValue?: string; // например, 'id'
}