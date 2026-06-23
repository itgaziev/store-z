'use client';

export type DateOperator = 'less' | 'more' | 'between';

export interface IDateFilterValue {
    operator: DateOperator;
    value: string; // Формат: YYYY-MM-DDTHH:mm:ss
    valueTo: string; // Формат: YYYY-MM-DDTHH:mm:ss
}

interface FilterDateProps {
    value: IDateFilterValue | undefined;
    onChange: (value: IDateFilterValue | undefined) => void;
}

export const FilterDate = ({ value, onChange }: FilterDateProps) => {
    const currentOperator = value?.operator || 'less';
    const currentValue = value?.value || '';
    const currentValueTo = value?.valueTo || '';

    const getLocalCurrentDateTime = (): string => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        return new Date(now.getTime() - offset).toISOString().slice(0, 19);
    }

    const updateFilterValue = (val: string, valTo: string) => {
        if (!val && !valTo) {
            onChange(undefined);
            return;
        }
        const finalTo = (val && !valTo) ? getLocalCurrentDateTime() : valTo;

        onChange({
            operator: currentOperator,
            value: val,
            valueTo: finalTo,
        });
    };

    const updateFilterOperator = (nextOp: DateOperator) => {
        const finalTo = (nextOp === 'between' && currentValue && !currentValueTo) ? getLocalCurrentDateTime() : currentValueTo;

        onChange({
            operator: nextOp,
            value: currentValue,
            valueTo: nextOp === 'between' ? finalTo : '',
        })
    }

    return (
        <div className="space-y-1.5 w-full">
            <select
                value={currentOperator}
                onChange={e => {
                    const nextOp = e.target.value as DateOperator;
                    updateFilterOperator(nextOp);
                }}
                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
                <option value="more">Больше (&gt;=)</option>
                <option value="less">Меньше (&lt;=)</option>
                <option value="between">В интервале (от ... до)</option>
            </select>

            <div className="flex flex-col gap-2">
                {currentOperator === 'between' ? (
                    <>
                        {/* Поле "От" */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 w-5 text-right shrink-0">От</span>
                            <input
                                type="datetime-local"
                                step="1"
                                value={currentValue}
                                max={currentValueTo || undefined}
                                onChange={(e) => updateFilterValue(e.target.value, currentValueTo)}
                                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                            />
                        </div>

                        {/* Поле "До" */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 w-5 text-right shrink-0">До</span>
                            <input
                                type="datetime-local"
                                step="1"
                                value={currentValueTo}
                                min={currentValue || undefined}
                                onChange={(e) => updateFilterValue(currentValue, e.target.value)}
                                className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <input
                            type="datetime-local"
                            step="1"
                            value={currentValue}
                            onChange={(e) => updateFilterValue(e.target.value, currentValueTo)}
                            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}