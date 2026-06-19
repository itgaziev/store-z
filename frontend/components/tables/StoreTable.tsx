'use client';

import { Column, TableData } from "@/lib/types/table.types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
type StoreTableProps = {
    isMulti: boolean;
    columns: Column[];
    rows: any[];
    onSelect?: (indexs: number[]) => void
}

export const StoreTable = (props: StoreTableProps) => {
    const { columns, rows } = props;
    const { onSelect } = props

    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [lastSelectedId, setLastSelectedId] = useState<number | null>(null);
    const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    const singleClickHandler = (event: React.MouseEvent, index: number, row: any) => {
        if (event.shiftKey) {
            event.preventDefault();
        }

        const isCmdOrCtrl = isMac ? event.metaKey : event.ctrlKey;

        // Переменная, в которую мы запишем итоговый массив выбранных индексов
        let nextSelected: number[] = [];

        if (event.shiftKey && lastSelectedId !== null && props.isMulti) {
            const start = Math.min(lastSelectedId, index);
            const end = Math.max(lastSelectedId, index);
            const rangeIds = Array.from({ length: end - start + 1 }, (_, i) => start + i);

            if (isCmdOrCtrl) {
                // Поскольку нам нужен чистый массив прямо сейчас, берем текущий selectedItems
                nextSelected = Array.from(new Set([...selectedItems, ...rangeIds]));
            } else {
                nextSelected = rangeIds;
            }
        } else if (isCmdOrCtrl && props.isMulti) {
            if (selectedItems.includes(index)) {
                nextSelected = selectedItems.filter(id => id !== index);
            } else {
                nextSelected = [...selectedItems, index];
            }
        } else {
            nextSelected = [index];
        }

        // 1. Обновляем локальный стейт для визуала (подсветка строк tr)
        setSelectedItems(nextSelected);
        setLastSelectedId(index);

        // 2. Сразу же отдаем родителю актуальный массив, гарантируя отсутствие рассинхронизации
        if (onSelect) {
            onSelect(nextSelected);
        }
    }

    const doubleClickHandler = (event: React.MouseEvent, row: any) => {
        console.log(`Двойной клик по элементу с ID: ${row}`);
    }

    return (
        <table className="w-full select-none divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                    {columns.filter(c => c.show).map(col => {
                        const isAuto = col.width === 'auto';
                        const widthStyle = isAuto
                            ? { width: 'auto' }
                            : { width: `${col.width}px`, minWidth: `${col.width}px` };
                        return (
                            <th key={col.id} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase" style={widthStyle}>
                                {col.title}
                                {/* Сюда можно добавить UI для изменения ширины (resizable) */}
                            </th>
                        )
                    })}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {rows.map((row: Record<string, any>, i: number) => {

                    return (
                        <tr
                            key={i}
                            className={cn("hover:bg-blue-50 cursor-pointer", {
                                "bg-blue-100": selectedItems.includes(i),
                            })}
                            onClick={(e) => singleClickHandler(e, i, row)}
                            onDoubleClick={(e) => doubleClickHandler(e, row)}
                        >
                            {columns.filter(c => c.show).map(col => (
                                <td
                                    key={col.id}
                                    className="px-4 py-3 text-xs text-gray-900 whitespace-nowrap truncate"
                                    style={{ width: col.width == 'auto' ? 'auto' : `${col.width}px` }}
                                >
                                    {row[col.id]}
                                </td>
                            ))}
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
}