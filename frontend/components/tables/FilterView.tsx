'use client'

import { IFilterTable } from "@/lib/types/table.types";
import { IFilterItem } from "@/lib/types/table.types";
import { useState } from "react";
import { FilterField } from "./FilterField";
import { IDateFilterValue } from "../filter/FilterDate";
import { IStringFilterValue } from "../filter/FilterString";

interface FilterViewProps {
    config?: IFilterTable[];
    onFilter?: (filters: IFilterItem[]) => void;
    onReset?: () => void;
}

/**
 * Преобразует сырые значения полей фильтра в массив IFilterItem[],
 * совместимый с телом POST /users/list на бэкенде.
 */
function buildFilterItems(
    config: IFilterTable[],
    values: Record<string, any>,
): IFilterItem[] {
    const result: IFilterItem[] = [];

    for (const field of config) {
        const val = values[field.id];
        if (val == null) continue;

        switch (field.type) {
            case 'STRING': {
                const sv = val as IStringFilterValue;
                if (!sv?.value?.trim()) break;
                result.push({ key: field.id, operator: sv.operator, value: sv.value.trim() });
                break;
            }

            case 'DATE': {
                const dv = val as IDateFilterValue;
                if (!dv?.value) break;

                if (dv.operator === 'between') {
                    if (!dv.valueTo) break;
                    // Бэкенд ожидает: "2026-01-01T00:00:00|2026-06-28T23:59:59"
                    result.push({
                        key: field.id,
                        operator: 'between',
                        value: `${dv.value}|${dv.valueTo}`,
                    });
                } else {
                    result.push({ key: field.id, operator: dv.operator, value: dv.value });
                }
                break;
            }

            case 'MODAL': {
                // MODAL возвращает выбранный bindValue (строку — UUID роли)
                if (typeof val === 'string' && val.trim()) {
                    result.push({ key: field.id, operator: 'equal', value: val.trim() });
                }
                break;
            }

            case 'SELECT': {
                if (typeof val === 'string' && val.trim()) {
                    result.push({ key: field.id, operator: 'equal', value: val.trim() });
                }
                break;
            }

            default:
                break;
        }
    }

    return result;
}

export const FilterView = ({ config = [], onFilter, onReset }: FilterViewProps) => {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({});

    const handleFilterChange = (id: string, value: any) => {
        setFilterValues(prev => ({ ...prev, [id]: value }));
    };

    const applyFilters = () => {
        if (onFilter) {
            onFilter(buildFilterItems(config, filterValues));
        }
    };

    const resetFilters = () => {
        setFilterValues({});
        onReset?.();
        onFilter?.([]);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 space-y-2 pb-4 overflow-y-auto custom-scrollbar p-1">
                {config.map((filter) => (
                    <div key={filter.id} className="space-y-1.5">
                        {filter.type !== 'CHECKBOX' && (
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                {filter.title}
                            </label>
                        )}

                        <FilterField
                            filter={filter}
                            value={filterValues[filter.id]}
                            onChange={(val) => handleFilterChange(filter.id, val)}
                        />
                    </div>
                ))}
            </div>

            <div className="pt-4 border-t border-gray-200 flex gap-2 shrink-0">
                <button
                    onClick={applyFilters}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                >
                    Применить
                </button>
                <button
                    onClick={resetFilters}
                    className="px-3 py-2 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors"
                >
                    Сбросить
                </button>
            </div>
        </div>
    );
};