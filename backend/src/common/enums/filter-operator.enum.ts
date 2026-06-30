/**
 * Allowed filter operators for query-builder filters.
 * Used across multiple modules (users, products, etc.)
 */
export type FilterOperator =
    | 'equal'
    | 'not-equal'
    | 'contain'
    | 'not-contain'
    | 'between'
    | 'less'
    | 'more';

export const ALL_OPERATORS: FilterOperator[] = [
    'equal',
    'not-equal',
    'contain',
    'not-contain',
    'between',
    'less',
    'more',
];
