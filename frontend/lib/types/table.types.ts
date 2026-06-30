export type SortDirection = 'ASC' | 'DESC';

export type Actions = {
    edit?: (item: any) => void;
    delete?: (item: any) => void;
}

// ─── Операторы фильтрации (зеркало бэкенда FilterOperator) ───────────────────

export type FilterOperator =
    | 'equal'
    | 'not-equal'
    | 'contain'
    | 'not-contain'
    | 'between'
    | 'less'
    | 'more';

// ─── Единица фильтра (зеркало бэкенда FilterItemDto) ─────────────────────────

export interface IFilterItem {
    /** Поле сущности для фильтрации */
    key: string;
    /** Оператор сравнения */
    operator: FilterOperator;
    /**
     * Значение фильтра.
     * Для оператора "between" на датах — две даты через "|": "2026-01-01|2026-06-28"
     */
    value: string;
}

// ─── Тело POST /users/list (зеркало бэкенда FindUsersBodyDto) ────────────────

export interface IFindByBodyRequest {
    /** Глобальный поиск по нескольким полям (OR-логика на бэке) */
    searchTerm?: string;
    /** Массив полевых фильтров (AND-логика на бэке) */
    filters?: IFilterItem[];
    /** Поле для сортировки */
    sort?: string;
    /** Направление сортировки */
    sortType?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
}

// ─── Колонки таблицы ──────────────────────────────────────────────────────────

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

// ─── Конфигурация фильтров ────────────────────────────────────────────────────

export interface IFilterTableOption {
    value: string | number;
    label: string;
}

export interface IFilterTable {
    id: string;
    title: string;
    type: 'STRING' | 'SELECT' | 'CHECKBOX' | 'MODAL' | 'BOOLEAN' | 'NUMBER' | 'DATE';
    endpoint?: string; // Для SELECT и MODAL, откуда качать данные

    // Новые полезные поля:
    placeholder?: string;
    // Ключи, которые нужно вытащить из ответа бэкенда для отображения
    bindLabel?: string; // например, 'name' или 'email'
    bindValue?: string; // например, 'id'
    options?: { value: string | number; label: string }[]
}