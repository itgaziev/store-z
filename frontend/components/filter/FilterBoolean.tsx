'use client';

interface FilterBooleanProps {
    value: any;
    onChange: (value: any) => void;
}

export const FilterBoolean = ({ value, onChange }: FilterBooleanProps) => {
    return (
        <select
            value={value === undefined || value === null ? '' : String(value)}
            onChange={e => {
                const val = e.target.value;
                if (val === '') onChange(undefined);
                if (val === 'true') onChange(true);
                if (val === 'false') onChange(false);
            }}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        >
            <option value="">Все</option>
            <option value="true">Да</option>
            <option value="false">Нет</option>
        </select>
    )
}