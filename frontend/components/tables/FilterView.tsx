'use client'

import { IFilterTable } from "@/lib/types/table.types";
import { useState } from "react";
import { FilterField } from "./FilterField";

interface FilterViewProps {
    config: IFilterTable[];
}

export const FilterView = ({ config }: FilterViewProps) => {
    const [filterValues, setFilterValues] = useState<Record<string, any>>({})

    const handleFilterChange = (id: string, value: any) => {
        setFilterValues(prev => ({
            ...prev,
            [id]: value
        }));
    }

    const applyFilters = () => {
        console.log('Send filter data on server', filterValues);
    }

    const resetFilters = () => {
        setFilterValues({})
    }

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
    )
}