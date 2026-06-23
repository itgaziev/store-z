'use client';

export type StringOperator = 'equal' | 'contain' | 'not-contain' | 'not-equal';

export interface IStringFilterValue {
    operator: StringOperator;
    value: string;
}

interface FilterStringProps {
    value: IStringFilterValue | undefined;
    onChange: (value: IStringFilterValue | undefined) => void;
    placeholder?: string; 
}

export const FilterString = ({ value, onChange, placeholder} : FilterStringProps) => {
    const currentOperator = value?.operator || 'contain';
    const currentValue = value?.value || '';

    const updateFilter = (operator: StringOperator, val: string) => {
        onChange({
            operator,
            value: val
        });
    };

    return (
        <div className="space-y-1.5 w-full">
            <select
                value={currentOperator}
                onChange={e => {
                    const nextOp = e.target.value as StringOperator;
                    updateFilter(nextOp, currentValue);
                }}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
                <option value="contain">Содержит</option>
                <option value="equal">Равно</option>
                <option value="not-contain">Не содержит</option>
                <option value="not-equal">Не равно</option>
            </select>

            <div className="flex items-center gap-2">
                <input 
                    type="text"
                    placeholder={ placeholder || 'Введить искомое слово ...'}
                    value={currentValue}
                    onChange={e => updateFilter(currentOperator, e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>
        </div>
    )
}