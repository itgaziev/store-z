'use client';

export type NumberOperator = 'equal' | 'less' | 'more' | 'between';

export interface INumberFilterValue {
    operator: NumberOperator;
    value: string;
    valueTo?: string;
}

interface FilterNumberFieldProps {
    value: INumberFilterValue | undefined;
    onChange: (value: INumberFilterValue | undefined) => void;
    placeholder?: string;
}

export const FilterNumberField = ({ value, onChange, placeholder }: FilterNumberFieldProps) => {
    const currentOperator = value?.operator || 'equal';
    const currentValue = value?.value || '';
    const currentValueTo = value?.valueTo || '';

    const updateFilter = (operator: NumberOperator, val: string, valTo?: string) => {
        if (!val && !valTo && operator === currentOperator) {
            onChange(undefined);
            return;
        }

        onChange({
            operator,
            value: val,
            ...(operator === 'between' ? { valueTo: valTo || '' } : {})
        });
    };

    return (
        <div className="space-y-1.5 w-full">
            <select
                value={currentOperator}
                onChange={e => {
                    const nextOp = e.target.value as NumberOperator;
                    updateFilter(nextOp, currentValue, nextOp === 'between' ? currentValueTo : undefined);
                }}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
                <option value="equal">Равно (=)</option>
                <option value="more">Больше (&gt;=)</option>
                <option value="less">Меньше (&lt;=)</option>
                <option value="between">В интервале (от ... до)</option>
            </select>

            <div className="flex items-center gap-2">
                {currentOperator === 'between' ? (
                    <>
                        <input
                            type="number"
                            placeholder="От"
                            value={currentValue}
                            onChange={(e) => updateFilter(currentOperator, e.target.value, currentValueTo)}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <span className="text-gray-400 text-xs">—</span>
                        <input
                            type="number"
                            placeholder="До"
                            value={currentValueTo}
                            onChange={(e) => updateFilter(currentOperator, currentValue, e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </>
                ) : (
                    <input
                        type="number"
                        placeholder={placeholder || 'Введите число ...'}
                        value={currentValue}
                        onChange={e => updateFilter(currentOperator, e.target.value)}
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500"
                    />
                )}
            </div>
        </div>
    )
}