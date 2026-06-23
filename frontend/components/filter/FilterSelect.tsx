'use client';

import { IFilterTableOption } from "@/lib/types/table.types";

interface FilterSelectProps {
    value: any;
    onChange: (value: any) => void;
    options?: IFilterTableOption[];
}

export const FilterSelect = ({ value, onChange, options = [] }: FilterSelectProps) => {
    return (
        <select
            value={value || ''}
            onChange={e => onChange(e.target.value || undefined)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"        >
                <option value="">Все</option>
                { options.map(opt => (
                    <option key={opt.value} value={opt.value}>{ opt.label }</option>
                ))}
        </select>
    );
}